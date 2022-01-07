import { myFetch } from "./helpers.js";

const form = document.querySelector('form');

//opret ny sang
const createNewSong = async () => {
    reset();
    const data = await myFetch('http://localhost:4000/api/songs');

    //title
    const titleHead = document.createElement('label');
    titleHead.setAttribute('for', 'title');
    titleHead.innerHTML = 'Title';
    form.append(titleHead);

    const title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('name', 'title');
    title.setAttribute('id', 'title');
    title.setAttribute('value', '');
    form.append(title)


    //artist
    const artistHead = document.createElement('label');
    artistHead.setAttribute('for', 'artist');
    artistHead.innerHTML = 'Kunstner navn';
    form.append(artistHead);

    const select = document.createElement('select');
    select.setAttribute('name', 'artist_id');
    form.append(select);

    const artist = document.createElement('option');
    artist.setAttribute('value', data.artist_id);
    artist.innerText = ''
    select.append(artist);

    select.addEventListener('click', async () => {
        data.map(function(item, key){
            const artist = document.createElement('option');
            artist.setAttribute('value', item.artist.id);
            artist.innerText = item.artist.name;
            select.append(artist);
        })
    })
    form.append(artist);

    //sang tekst
    const contentHead = document.createElement('label');
    contentHead.setAttribute('for', 'content');
    contentHead.innerHTML = 'Sang tekst';
    form.append(contentHead);

    const content = document.createElement('textarea');
    content.setAttribute('name', 'content');
    content.innerHTML = '';
    form.append(content);
    
    //opdater button
    const createBtn = document.createElement('button');
    createBtn.setAttribute('type','button');
    createBtn.classList.add('createBtn');
    createBtn.innerText = "Opret sang";
    form.append(createBtn);
    createBtn.addEventListener('click', async () => {
        //bliver lavet på denne måde da det ikke er et rigtigt API
        const params = new URLSearchParams();
        params.append('title', form.title.value);
        params.append('artist_id', form.artist_id.value);
        params.append('content', form.content);
        
        let options = {
            method: 'POST', 
            body: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
        };
        
        const data = await myFetch(`http://localhost:4000/api/songs`, options);
        //meddelese
        if (confirm(`Vil du oprette sangen?`)) {
            createNewSong();
        };
    })
}
createNewSong();

function reset() {
    form.innerHTML = '';
}
export { createNewSong }