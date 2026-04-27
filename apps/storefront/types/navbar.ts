export interface NAVBAR_MENU {
  name: string;
  path: string;
  innerContent?: {
    name: string;
    path: string;
    image?: string;
  }[];
}
