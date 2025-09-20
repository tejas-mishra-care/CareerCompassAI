export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = [
  {
    "id": "welcome",
    "description": "A person looking at a crossroads, symbolizing career choices.",
    "imageUrl": "https://picsum.photos/seed/welcome/300/300",
    "imageHint": "career choice"
  },
  {
    "id": "simulations",
    "description": "A focused person working on a complex problem on a computer screen.",
    "imageUrl": "https://picsum.photos/seed/simulations/600/400",
    "imageHint": "problem solving"
  }
];
