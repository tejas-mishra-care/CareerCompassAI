export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = [
  {
    "id": "welcome",
    "description": "A futuristic, glowing compass interface, symbolizing AI-powered career guidance.",
    "imageUrl": "https://picsum.photos/seed/future/600/400",
    "imageHint": "futuristic compass"
  },
  {
    "id": "simulations",
    "description": "A focused person working on a complex problem on a computer screen.",
    "imageUrl": "https://picsum.photos/seed/simulations/600/400",
    "imageHint": "problem solving"
  }
];
