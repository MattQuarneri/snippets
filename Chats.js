function extractLinksAndTitles() {
    const links = document.querySelectorAll('li div a');
    const result = {};
  
    links.forEach(link => {
      const href = link.href
      const title = link.children[0].title
      result[title] = href;
    });
  
    return result;
}

function exportToJSON(data, name){
    var jsonString = JSON.stringify(data, null, 2); // null, 2 for pretty formatting
    var blob = new Blob([jsonString], { type: 'application/json' });

    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name +'.json';

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function SaveChats(){
    let chats_current = extractLinksAndTitles();
    let chats_saved = JSON.parse(localStorage.getItem('chats'));

    for (let chat in chats_current){
        if (!chats_saved[chat]){
            chats_saved[chat] = chats_current[chat];
        }
    }
    localStorage.setItem('chats', JSON.stringify(chats_saved));
    console.log('Chats Saved');
}

//let chats = JSON.parse(localStorage.getItem('chats'));