export const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result); // Resolve with the file data URL
        }
      };
  
      reader.onerror = (error) => {
        reject(error); // Reject in case of an error
      };
  
      reader.readAsDataURL(file); // Read the file as a data URL
    });
  };
  