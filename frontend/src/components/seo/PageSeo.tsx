import type { Metadata } from 'next';

interface PageSeoProps {
  title: string;
  description: string;
  image?: string;
}

export function generatePageMetadata({ title, description, image }: PageSeoProps): Metadata {
  return {
    title: `${title} | StudentPG`,
    description,
    openGraph: {
      title,
      description,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
