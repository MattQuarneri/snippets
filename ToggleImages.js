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

function hasClassContainingSubstring(element, substring) {
    if(!element || !element.classList)
        return false;
    return Array.from(element.classList).some(cls => cls.includes(substring));
}

function toggleDis(elem){
    if(!elem)
        return
    
    if(hasClassContainingSubstring(elem.parentElement,'image')){
        elem.parentElement.style.display = imagesHidden ? "" : "none";
    }else{
        toggleDis(elem.parentElement);
    }
}

let imagesHidden = false;
function toggleImages(evt){
    evt.target.textContent = imagesHidden? "Imgs On" : "Imgs Off";
    const images = getAllImages();
    images.forEach(img => {
        img.style.display = imagesHidden ? "" : "none";
        toggleDis(img);
    });
    imagesHidden = !imagesHidden;
}

// Create a toggle button
const toggleButton = document.createElement("button");
toggleButton.textContent = "Imgs On";
toggleButton.style.position = "fixed";
toggleButton.style.top = "10px";
toggleButton.style.right = "10px";
toggleButton.style.zIndex = "1000";
toggleButton.addEventListener("click", toggleImages);
document.body.appendChild(toggleButton);

// Prompt for choice
if (window.confirm("Hide All Images?")) {
    const mockEvent = { target: toggleButton };
    toggleImages(mockEvent);
}