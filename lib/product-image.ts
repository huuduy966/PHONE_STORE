export function productImageSource(image: string): string {
  return /^(https:\/\/|data:image\/)/i.test(image) ? image : '/images/' + image;
}
