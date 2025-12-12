"use client";

import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
  disabled?: boolean;
  align?: "left" | "right";
  "data-testid"?: string;
  labels?: {
    edit?: string;
    remove?: string;
  };
};

export default function Dropdown({
  onEdit,
  onDelete,
  disabled,
  align = "right",
  labels,
  ...rest
}: Props) {
  const [open, setOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties | null>(null);

  // fechar com clique fora e ESC
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (menuRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open]);

  // When opening, detect available space and decide whether to render menu above
  useEffect(() => {
    if (!open || !btnRef.current) return;
    const btn = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - btn.bottom;
    const spaceAbove = btn.top;
    // approximate menu height; if there's more space above than below, open upwards
    const approxMenuHeight = 140;
    setDropUp(spaceBelow < approxMenuHeight && spaceAbove > spaceBelow);
    setAnchorRect(btn);
  }, [open]);

  // Recompute anchor rect on scroll/resize while open so the floating menu stays aligned
  useEffect(() => {
    if (!open) return;
    function handlePosChange() {
      if (!btnRef.current) return;
      setAnchorRect(btnRef.current.getBoundingClientRect());
    }
    window.addEventListener("resize", handlePosChange);
    // use capture so scrolls on containers bubble
    window.addEventListener("scroll", handlePosChange, true);
    return () => {
      window.removeEventListener("resize", handlePosChange);
      window.removeEventListener("scroll", handlePosChange, true);
    };
  }, [open]);

  // After menu mounts, measure and position it in the viewport using fixed positioning
  useLayoutEffect(() => {
    if (!open || !anchorRect || !menuRef.current) return;
    const menu = menuRef.current;
    const menuW = menu.offsetWidth;
    const menuH = menu.offsetHeight;

    let left = anchorRect.left;
    if (align === "right") {
      left = anchorRect.right - menuW;
    }

    // clamp horizontally to viewport with 8px padding
    const minLeft = 8;
    const maxLeft = window.innerWidth - menuW - 8;
    left = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));

    let style: React.CSSProperties = { position: "fixed", left: Math.round(left), zIndex: 9999 };

    if (dropUp) {
      // position above the button
      style.top = undefined;
      style.bottom = Math.round(window.innerHeight - anchorRect.top + 8);
    } else {
      style.top = Math.round(anchorRect.bottom + 8);
      style.bottom = undefined;
    }

    setMenuStyle(style);
  }, [open, anchorRect, align, dropUp]);

  return (
    <div className="relative inline-block text-left" {...rest}>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={!!disabled}
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-40"
      >
        <MoreVertical className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Abrir ações</span>
      </button>

      {open && anchorRect && createPortal(
        <div
          ref={menuRef}
          role="menu"
          tabIndex={-1}
          style={menuStyle ?? { position: "fixed", left: 0, top: 0 }}
          className={`min-w-40 rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none`}
        >
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onEdit?.();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-t-xl hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
          >
            <Pencil className="h-4 w-4" />
            <span>{labels?.edit ?? "Editar"}</span>
          </button>

          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onDelete?.();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-b-xl hover:bg-red-50 focus:bg-red-50 focus:outline-none"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
            <span className="text-red-600">{labels?.remove ?? "Excluir"}</span>
          </button>
        </div>,
        document.body
      )}
    </div>
  );
}
