module.exports = function({ file, width, height, type, ratio }) {
  return new Promise(function(resolve, reject) {
    let allow = ["jpg", "gif", "bmp", "png", "jpeg"];
    try {
      if (
        file.name &&
        file.name.split(".").pop() &&
        allow.includes(
          file.name
            .split(".")
            .pop()
            .toLowerCase()
        ) &&
        file.size &&
        file.type
      ) {
        let imageType = type ? type : "jpeg";
        let imgWidth = width ? width : 500;
        let imgHeight = height ? height : 300;
        const fileName = file.name;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = event => {
          const img = new Image();
          img.src = event.target.result;
          (img.onload = () => {
            console.log({ image: img });

            if (ratio && img.height && img.width) {
              if (ratio === "w") {
                imgHeight = (img.height * imgWidth) / img.width;
              }
              if (ratio === "h") {
                imgWidth = (img.width * imgHeight) / img.height;
              }
            }

            const elem = document.createElement("canvas");
            elem.width = imgWidth;
            elem.height = imgHeight;
            const ctx = elem.getContext("2d");
            ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
            ctx.canvas.toBlob(
              blob => {
                const file = new File([blob], fileName, {
                  type: `image/${imageType.toLowerCase()}`,
                  lastModified: Date.now()
                });
                resolve(file);
              },
              "image/jpeg",
              1
            );
          }),
            (reader.onerror = error => reject(error));
        };
      } else reject("File not supported!");
    } catch (error) {
      console.log("Error while image resize: ", error);
      reject(error);
    }
  });
};
