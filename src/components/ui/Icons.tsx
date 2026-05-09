/**
 * Centralized icon exports — all from react-icons/lu (Lucide).
 * Consistent outline style, 2px stroke, currentColor.
 */

import {
  LuGithub,
  LuLinkedin,
  LuMail,
  LuDownload,
  LuExternalLink,
  LuSun,
  LuMoon,
  LuArrowLeft,
  LuArrowRight,
  LuMapPin,
  LuCalendar,
  LuAward,
  LuUsers,
  LuMessageCircle,
  LuX,
  LuSend,
  LuArrowDown,
} from "react-icons/lu";

export {
  LuGithub as GitHubIcon,
  LuLinkedin as LinkedInIcon,
  LuMail as EmailIcon,
  LuDownload as DownloadIcon,
  LuExternalLink as ExternalLinkIcon,
  LuSun as SunIcon,
  LuMoon as MoonIcon,
  LuArrowLeft as ArrowLeftIcon,
  LuArrowRight as ArrowRightIcon,
  LuMapPin as MapPinIcon,
  LuCalendar as CalendarIcon,
  LuAward as AwardIcon,
  LuUsers as UsersIcon,
  LuMessageCircle as ChatIcon,
  LuX as CloseIcon,
  LuSend as SendIcon,
  LuArrowDown as ArrowDownIcon,
};

export function platformIcon(platform: string, size = 18) {
  switch (platform) {
    case "GitHub":
      return <LuGithub size={size} />;
    case "LinkedIn":
      return <LuLinkedin size={size} />;
    case "Email":
      return <LuMail size={size} />;
    default:
      return null;
  }
}
