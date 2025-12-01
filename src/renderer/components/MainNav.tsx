import * as React from "react";
import { Link, useLocation } from "react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { nav_links, utility_links } from "@/shared/constants/navConstants";

type MainNavProps = {
  collapsed: boolean;
};

export default function MainNav({ collapsed }: Readonly<MainNavProps>) {
  return (
    <aside
      className={cn(
        "h-full flex flex-col bg-gray-900 border-r transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}>
      <header className='h-16 flex items-center px-4 border-b text-white'>
        {!collapsed ? (
          <h1 className='text-[22px] font-bold'>MCGS</h1>
        ) : (
          <div className='w-full flex justify-center'>
            <span className='font-bold text-[18px]'>MCGS</span>
          </div>
        )}
      </header>
      <nav className='flex-grow overflow-y-auto py-4 px-2'>
        <div className='space-y-1'>
          {nav_links.map((link) => (
            <NavItem key={link.path} link={link} collapsed={collapsed} />
          ))}
        </div>
      </nav>
      <div className='overflow-y-auto py-4 px-2'>
        {/* <Link
          to={""}
          onClick={(e) => {
            e.preventDefault();
            toggleCapture();
          }}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            canCapture
              ? "bg-gray-200 dark:bg-gray-800 text-blue-700 dark:text-blue-400"
              : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          )}>
          <ScanBarcodeIcon size={40} />
          {!collapsed && <span>Start/Stop Scanner</span>}
        </Link> */}
      </div>
      <footer className='space-y-1 px-2 border-t'>
        {utility_links.map((link) => (
          <NavItem key={link.path} link={link} collapsed={collapsed} />
        ))}
      </footer>
    </aside>
  );
}

type NavItemProps = {
  link: {
    title: string;
    path: string;
    Icon: React.ComponentType<{ size?: number }>;
    subLinks?: Array<{
      title: string;
      path: string;
      Icon: React.ComponentType<{ size?: number }>;
      subLinks?: any[];
    }>;
  };
  collapsed: boolean;
};

function NavItem({ link, collapsed }: Readonly<NavItemProps>) {
  const location = useLocation();
  const { title, path, Icon, subLinks } = link;
  const isActive = isLinkActive(location.pathname, path);
  const hasSubLinks = subLinks && subLinks.length > 0;
  const [open, setOpen] = React.useState(isActive && hasSubLinks);

  // Check if any sublink is active
  const isSubLinkActive =
    hasSubLinks &&
    subLinks.some((subLink) => isLinkActive(location.pathname, subLink.path));

  // Determine if this item should be highlighted
  const isHighlighted = isActive || isSubLinkActive;

  if (hasSubLinks) {
    return (
      <Collapsible
        open={open && !collapsed}
        onOpenChange={collapsed ? undefined : setOpen}>
        <div className='relative'>
          <div className='relative flex items-center w-full'>
            <Link
              to={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors flex-grow",
                isHighlighted
                  ? "bg-gray-200 dark:bg-gray-800 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}>
              <Icon size={collapsed ? 24 : 20} />
              {!collapsed && <span className='flex-grow'>{title}</span>}
            </Link>

            {!collapsed && hasSubLinks && (
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "p-2 rounded-md ml-1 hover:bg-gray-200 dark:hover:bg-gray-800",
                    isHighlighted
                      ? "text-blue-700 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      open ? "transform rotate-180" : ""
                    )}
                  />
                </button>
              </CollapsibleTrigger>
            )}
          </div>
        </div>

        {!collapsed && (
          <CollapsibleContent className='pl-9 mt-1 space-y-1'>
            {subLinks.map((subLink) => (
              <SubNavItem key={subLink.path} link={subLink} />
            ))}
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  }

  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isHighlighted
          ? "bg-gray-200 dark:bg-gray-800 text-blue-700 dark:text-blue-400"
          : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
      )}>
      <Icon size={collapsed ? 24 : 20} />
      {!collapsed && <span>{title}</span>}
    </Link>
  );
}

function SubNavItem({ link }: Readonly<{ link: NavItemProps["link"] }>) {
  const location = useLocation();
  const { title, path, Icon, subLinks } = link;
  const isActive = isLinkActive(location.pathname, path);
  const hasSubLinks = subLinks && subLinks.length > 0;
  const [open, setOpen] = React.useState(isActive && hasSubLinks);

  // Check if any sublink is active
  const isSubLinkActive =
    hasSubLinks &&
    subLinks.some((subLink) => isLinkActive(location.pathname, subLink.path));

  // Determine if this item should be highlighted
  const isHighlighted = isActive || isSubLinkActive;

  if (hasSubLinks) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className='relative'>
          <CollapsibleTrigger asChild>
            <Link
              to={path}
              onClick={(e) => {
                if (hasSubLinks) {
                  e.preventDefault();
                  setOpen(!open);
                }
              }}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isHighlighted
                  ? "bg-gray-200 dark:bg-gray-800 text-blue-700 dark:text-blue-400"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              )}>
              <Icon size={16} />
              <span className='flex-grow'>{title}</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  open ? "transform rotate-90" : ""
                )}
              />
            </Link>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className='pl-9 mt-1 space-y-1'>
          {subLinks.map((subLink) => (
            <SubNavItem key={subLink.path} link={subLink} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        isActive
          ? "bg-gray-200 dark:bg-gray-800 text-blue-700 dark:text-blue-400"
          : "hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
      )}>
      <Icon size={16} />
      <span>{title}</span>
    </Link>
  );
}

// Helper function to determine if a link is active
function isLinkActive(currentPath: string, linkPath: string): boolean {
  if (linkPath === "/") {
    return currentPath === "/";
  }
  return (
    currentPath === linkPath ||
    (linkPath !== "/" && currentPath.startsWith(linkPath))
  );
}
