import { myFetch } from "./helpers.js";

const songList = document.querySelector('.songList');

//hent liste af alle sange
const getSongList = async () => {
    reset();
    
    const data = await myFetch('http://localhost:4000/api/songs');
    const tr = document.createElement('tr');
    tr.classList.add('trHead')

    const th1 = document.createElement('th');
    th1.innerText = 'Title';
    tr.append(th1);

    const th2 = document.createElement('th');
    th2.innerText = 'Kunstner navn';
    tr.append(th2);

    const th3 = document.createElement('th');
    th3.innerText = 'Opdater';
    tr.append(th3);

    const th4 = document.createElement('th');
    th4.innerText = 'Slet';
    tr.append(th4);

    songList.append(tr);

    data.map(function(item, key){

        const wrapper = document.createElement('tr');
        wrapper.classList.add('trData');

        const td1 = document.createElement('td');
        const td2 = document.createElement('td');
        const td3 = document.createElement('td');
        const td4 = document.createElement('td');

        const link = document.createElement('a');
        link.setAttribute('href', '#');
        link.innerText = item.title;
        link.addEventListener('click', () => {
            getSongDetails(item.id);
        });
        td1.append(link);

        const artistName = document.createElement('a');
        artistName.innerText = item.artist.name;
        td2.append(artistName);

        const edit = document.createElement('a');
        edit.classList.add('edit');
        edit.innerHTML = '<i class="fas fa-pen"></i>';
        edit.addEventListener('click', () => {
            editSong(item.id)
        });
        td3.append(edit);

        const del = document.createElement('a');
        del.classList.add('del');
        del.innerHTML = '<i class="fas fa-trash-alt"></i>'
        del.addEventListener('click', () => {
            if (confirm(`Vil du slette sangen ${item.title} fra sangbogen?`)) {
                deleteSong(item.id);
            };
        });
        td4.append(del);
        wrapper.append(td1)
        wrapper.append(td2)
        wrapper.append(td3)
        wrapper.append(td4)
        songList.append(wrapper);
    });
};
getSongList();

//åben sang detajler
const getSongDetails = async song_id => {
    reset();

    const data = await myFetch(`http://localhost:4000/api/songs/${song_id}`);

    const div = document.createElement('div');
    div.classList.add('detailWrapper');

    const backBtn = document.createElement('button');
    backBtn.innerText = "Tilbage til liste"
    backBtn.addEventListener('click', () => {
        getSongList();
    })
    div.append(backBtn);
        
    const h2 = document.createElement('h2');
    h2.innerText = data.title;
    div.append(h2);
        
    const h3 = document.createElement('h3');
    h3.innerHTML = data.artist.name;
    div.append(h3);
        
    const pre = document.createElement('pre');
    pre.innerHTML = data.content;
    div.append(pre);
        
    songList.append(div);
}

//opdater sang
const editSong = async song_id => {
    reset();

    const data = await myFetch(`http://localhost:4000/api/songs/${song_id}`);

    const div = document.createElement('div');
    div.classList.add('editWrapper');

    const form = document.createElement('form');
    // form.setAttribute('method', 'POST');

    //title
    const titleHead = document.createElement('label');
    titleHead.setAttribute('for', 'title');
    titleHead.innerHTML = 'Title';
    form.append(titleHead);

    const title = document.createElement('input');
    title.setAttribute('type', 'text');
    title.setAttribute('name', 'title');
    title.setAttribute('id', 'title');
    title.setAttribute('value', data.title);
    form.append(title);

    //sang id
    const id = document.createElement('input');
    id.setAttribute('type', 'hidden');
    id.setAttribute('name', 'id');
    id.setAttribute('value', data.id);
    form.append(id);

    //kunstner navn
    const artistHead = document.createElement('label');
    artistHead.setAttribute('for', 'artist');
    artistHead.innerHTML = 'Kunstner navn';
    form.append(artistHead);

    const artist = document.createElement('input');
    artist.setAttribute('type', 'text');
    artist.setAttribute('name', 'artist_id');
    artist.setAttribute('value', data.artist_id);
    form.append(artist);

    //sang tekst
    const contentHead = document.createElement('label');
    contentHead.setAttribute('for', 'content');
    contentHead.innerHTML = 'Sang tekst';
    form.append(contentHead);

    const content = document.createElement('textarea');
    content.setAttribute('name', 'content');
    content.classList.add('editContent');
    content.innerHTML = data.content;
    form.append(content);

    //opdater button
    const editBtn = document.createElement('button');
    editBtn.setAttribute('type','button');
    editBtn.classList.add('editBtn');
    editBtn.innerText = "Opdater sang";
    form.append(editBtn);
    editBtn.addEventListener('click', async  function() {
        console.log(form.title.value);
        const formData = new FormData()
        formData.append('title', form.title.value);
        formData.append('id', form.id.value);
        formData.append('artist_id', form.artist_id.value);
        formData.append('content', form.content.value);
        console.log(...formData);
        let options = {
            method: 'put', 
            body: formData
        };
    const data = await myFetch(`http://localhost:4000/api/songs`, options);
    console.log(data);

    })





    div.append(form);
    songList.append(div);


}

//slet en sang
const deleteSong = async song_id => {
    reset();

    let options = {
        method: 'DELETE'
    };

    const data = await myFetch(`http://localhost:4000/api/songs/${song_id}`, options);

    window.location.reload();
}

function reset() {
    songList.innerHTML = '';
}

export { getSongList, getSongDetails, editSong, deleteSong }

