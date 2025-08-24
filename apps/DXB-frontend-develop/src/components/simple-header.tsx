import React from "react";
import { useLocation } from "react-router-dom";

interface SimpleHeaderProps {
  activeRoute?: string;
}

export function SimpleHeader({ activeRoute = "Main" }: SimpleHeaderProps) {
  const navigationItems = [
    { name: "Main", href: "/" },
    { name: "Analytics", href: "/analytics" }, 
    { name: "Reports", href: "/reports" },
    { name: "Payments", href: "/payment" },
    { name: "Pricing", href: "/pricing" },
  ];

  const handleNavClick = (href: string) => {
    window.location.href = href;
  };

  return (
    <header style={{
      width: "100%",
      backgroundColor: "white",
      borderBottom: "1px solid #e5e7eb",
      padding: "1rem 0",
      position: "sticky",
      top: 0,
      zIndex: 50,
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "0 1.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <div style={{
            width: "24px",
            height: "24px",
            backgroundColor: "#3b82f6",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold"
          }}>D</div>
          <span style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#111827"
          }}>Dubai MVP</span>
        </div>

        {/* Navigation */}
        <nav style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem"
        }}>
          {navigationItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavClick(item.href)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: activeRoute === item.name ? "#eff6ff" : "transparent",
                color: activeRoute === item.name ? "#2563eb" : "#6b7280",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (activeRoute !== item.name) {
                  e.currentTarget.style.backgroundColor = "#f9fafb";
                  e.currentTarget.style.color = "#374151";
                }
              }}
              onMouseLeave={(e) => {
                if (activeRoute !== item.name) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#6b7280";
                }
              }}
            >
              {item.name}
            </button>
          ))}
        </nav>

        {/* User Menu */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}>
          <button
            onClick={() => window.location.href = '/auth'}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#3b82f6", 
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500"
            }}
          >
            Sign In
          </button>
          <div style={{
            width: "32px",
            height: "32px", 
            backgroundColor: "#eff6ff",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#2563eb",
            fontSize: "14px",
            fontWeight: "600"
          }}>
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
