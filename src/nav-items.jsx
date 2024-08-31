import { HomeIcon, VideoIcon, ListIcon, CheckCircleIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import TalentSubmission from "./components/TalentSubmission.jsx";
import ViewSubmissions from "./components/ViewSubmissions.jsx";
import SubmissionSuccess from "./components/SubmissionSuccess.jsx";

/**
 * Central place for defining the navigation items. Used for navigation components and routing.
 */
export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Submit Talent",
    to: "/submit",
    icon: <VideoIcon className="h-4 w-4" />,
    page: <TalentSubmission />,
  },
  {
    title: "View Submissions",
    to: "/submissions",
    icon: <ListIcon className="h-4 w-4" />,
    page: <ViewSubmissions />,
  },
  {
    title: "Submission Success",
    to: "/success",
    icon: <CheckCircleIcon className="h-4 w-4" />,
    page: <SubmissionSuccess />,
  },
];
