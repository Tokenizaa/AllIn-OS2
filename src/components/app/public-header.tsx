import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useSponsorLink } from "@/hooks/useSponsorLink";
import { useAuth } from "@/modules/auth";
import { DashboardResolver } from "@/modules/auth/services/dashboardResolver.service";
import { UserRole } from "@/shared/types/roles";

export function PublicHeader() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { handleCadastro } = useSponsorLink();
  const { user } = useAuth();
  const dashboardHref = user ? DashboardResolver.getDashboardPathForUser(user) : "/login";

  // All authenticated users can access their dashboard
  const showDashboardButton = !!user;

  const navItems = [
    { label: "Inicio", href: "/" },
    { label: "Loja", href: "/loja" },
    { label: "Distribuidor", href: "/seja-distribuidor" },
    { label: "Documentação", href: "/docs" },
  ];

  return (
    <header className="fixed top-0 z-40 w-full border-b border-allin-orange/20 bg-allin-bg-light-1/95 shadow-sm backdrop-blur-md dark:border-allin-bg-dark-2 dark:bg-allin-bg-dark-1/95">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src="https://s3-sa-east-1.amazonaws.com/public-http-files/UploadArquivo/Arquivos/all_in_esp_br/Configuracao/logomarca_sistema_5eee718d4c5bf_logo-h.png"
              alt="Logo All-In"
              className="h-10 w-10 rounded-lg object-contain md:h-12 md:w-12"
            />
            <span className="text-xl font-bold text-allin-orange md:text-2xl">All-In</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`font-medium transition-colors ${
                  location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)
                    ? "text-allin-orange"
                    : "text-allin-dark hover:text-allin-orange dark:text-allin-white dark:hover:text-allin-orange"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {showDashboardButton ? (
              <Link to={dashboardHref}>
                <Button variant="outline" className="border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold">
                  Dashboard
                </Button>
              </Link>
            ) : user ? null : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold">
                    Entrar
                  </Button>
                </Link>
                <Button
                  onClick={handleCadastro}
                  className="bg-allin-orange font-semibold text-allin-white shadow-md hover:bg-allin-orange/90 hover:shadow-lg"
                >
                  Cadastrar gratis
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className="text-allin-dark transition-colors hover:text-allin-orange dark:text-allin-white"
              aria-label="Alternar menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden"
            >
              <div className="mt-4 space-y-3 border-t border-allin-orange/20 pt-4 dark:border-allin-bg-dark-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-2">
                  {showDashboardButton ? (
                    <Link to={dashboardHref}>
                      <Button
                        variant="outline"
                        className="w-full border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Button>
                    </Link>
                  ) : user ? null : (
                    <div className="space-y-2">
                      <Link to="/login">
                        <Button
                          variant="outline"
                          className="w-full border-allin-orange text-allin-orange hover:bg-allin-orange/10 font-semibold"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Entrar
                        </Button>
                      </Link>
                      <Button
                        onClick={() => {
                          handleCadastro();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-allin-orange font-semibold text-allin-white hover:bg-allin-orange/90"
                      >
                        Cadastrar gratis
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
