import {
  FacebookLogo,
  YoutubeLogo,
  TwitterLogo,
  InstagramLogo,
} from "@/components/icons/social-logo";
import type { ComponentType, SVGAttributes } from "react";

type SocialIcon = ComponentType<SVGAttributes<SVGSVGElement>>;

type SocialLink = {
  name: string;
  link: string;
  logo: SocialIcon;
};

export const SOCIALLINKS: SocialLink[] = [
  {
    name: "Facebook",
    link: "https://www.facebook.com/rjindiabathproducts/",
    logo: FacebookLogo,
  },
  {
    name: "Twitter",
    link: "https://www.facebook.com/rjindiabathproducts/",
    logo: TwitterLogo,
  },
  {
    name: "Youtube",
    link: "https://www.facebook.com/rjindiabathproducts/",
    logo: YoutubeLogo,
  },
  {
    name: "Instagram",
    link: "https://www.facebook.com/rjindiabathproducts/",
    logo: InstagramLogo,
  },
];
