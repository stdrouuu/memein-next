export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    if (!file || (file.type !== "image/jpeg" && file.type !== "image/png")) {
      reject(new Error("Invalid file type"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const calculateStageSize = (img: HTMLImageElement) => {
  const maxWidth = 600;
  const maxHeight = 400;
  const aspectRatio = img.width / img.height;

  let newWidth = maxWidth;
  let newHeight = maxWidth / aspectRatio;

  if (newHeight > maxHeight) {
    newHeight = maxHeight;
    newWidth = maxHeight * aspectRatio;
  }

  return { width: newWidth, height: newHeight };
};
