export function getImageDimensions(file) {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const dimensions = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      };

      URL.revokeObjectURL(imageUrl);
      resolve(dimensions);
    };

    image.onerror = () => {
      URL.revokeObjectURL(imageUrl);
      reject(new Error("Não foi possível identificar as dimensões da imagem."));
    };

    image.src = imageUrl;
  });
}