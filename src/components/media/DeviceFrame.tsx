import type { ReactNode } from "react";
import { Placeholder } from "../ui/Placeholder";

/** Glow frame with a browser toolbar; the content area is 16:10. */
export function BrowserFrame({ children, address, className = "" }: { children: ReactNode; address?: string; className?: string }) {
  return (
    <div className={`frame browser ${className}`}>
      <div className="frame-inner">
        <div className="browser-bar">
          <span className="browser-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {address && (
            <span className="browser-address">
              <Placeholder text={address} />
            </span>
          )}
        </div>
        <div className="browser-view">{children}</div>
      </div>
    </div>
  );
}

/** Phone bezel with a glowing edge; the screen is 9:19.5. */
export function PhoneFrame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`phone ${className}`}>
      <div className="phone-screen">
        {children}
        <span className="phone-island" aria-hidden="true" />
      </div>
    </div>
  );
}
