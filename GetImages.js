// URLs for the JSZip and FileSaver.js libraries
let jsZipUrl = "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js";
let fileSaverUrl = "https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js";

function loadScript(url, callback) {
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.onload = function() {
        callback();
    };
    script.src = url;
    document.head.appendChild(script);
}

function makePropertyUnique(objects, propertyPath) {
    const seen = new Map(); // To track occurrences of property values

    return objects.map(obj => {
        // Extract the property value using the property path
        const value = propertyPath.split('.').reduce((acc, key) => acc && acc[key], obj);
        if (value === undefined) return; // Skip if the property doesn't exist
        if (value == '') return;

        if (seen.has(value)) {
            // Increment the count and make the property unique
            const count = seen.get(value) + 1;
            seen.set(value, count);
            const uniqueValue = `${value}_${count}`;
            // Set the unique value back into the object
            setNestedProperty(obj, propertyPath, uniqueValue);
        } else {
            // First occurrence of the value
            seen.set(value, 0);
        }

        return obj;
    }).filter(value => value !== undefined);

    // Helper function to set a nested property value
    function setNestedProperty(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((acc, key) => acc[key], obj);
        if (target && lastKey) {
            target[lastKey] = value;
        }
    }
}

function getAllImages(root = document) {
    let images = [];
    
    // Collect all img elements in the current root
    const imgElements = root.querySelectorAll('img');
    images.push(...imgElements);
    
    // Recursively traverse shadow roots
    root.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) {
            images.push(...getAllImages(el.shadowRoot)); // Recursive call
        }
    });
    
    return images;
}

// Function to download all images as a zip
async function downloadImagesAsZip() {
    const zip = new JSZip();
    const imgFolder = zip.folder("images");
    //const images = document.querySelectorAll("img");
    let images = getAllImages();
    images = makePropertyUnique(images, "alt")
    
    const imagePromises = Array.from(images).map((img, index) => {
        
      let to = Math.max(img.src.indexOf('.jpg'), img.src.indexOf('.img'))
      if(to == 0)
          return

      return fetch(img.src.substr(0, to + 4))
        .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.blob();
        })
        .then(blob => {
          imgFolder.file(img.alt.replaceAll(' ','_') + '.jpg', blob); // Fallback to a default name if alt is empty
        })
        .catch(error => console.error('There was a problem with your fetch operation:', error));
    });
    
    // Wait for all images to be added to the zip
    await Promise.all(imagePromises);
  
    zip.generateAsync({type:"blob"}).then(function(content) {
      saveAs(content, "images.zip");
    });
  }
  
// Load JSZip first
loadScript(jsZipUrl, function() {
    console.log("JSZip loaded successfully!");

    // Then, load FileSaver.js
    loadScript(fileSaverUrl, function() {
        console.log("FileSaver.js loaded successfully!");

        // Now, you can run your code that depends on these libraries
        downloadImagesAsZip();
    });
});