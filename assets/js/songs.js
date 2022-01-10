import { myFetch } from "./helpers.js";

const songList = document.querySelector('.songList');
const main = document.querySelector('main');
// const search = document.querySelector('.search')

//overskriften ligger uden for getSongList for at man kan lave om på overskriften 
//når men kommer ind på editSong
const headLine = document.createElement('h1');
headLine.classList.add('headLine');
headLine.innerText = 'Liste over sange';
main.prepend(headLine);

//søg efter en sang
const search = async () => {

    const input = document.querySelector('.searchInput');
    const searchBtn = document.querySelector('.searchBtn');
    const data = await myFetch('http://localhost:4000/api/song/search');


}
search();

//hent liste af alle sange
const getSongList = async () => {
    reset();

    //skal også stå her for at "start" overskriften kommer frem når man bruger
    //hvilken som helst knap "tilbage knap"
    //tømmer overskriften og derefter
    headLine.innerHTML = '';
    //laver her efter en ny overskrift
    headLine.innerText = 'Liste over sange';
 
    const data = await myFetch('http://localhost:4000/api/songs');

    //liste over skrifter
    const tr = document.createElement('tr');
    tr.classList.add('trHead')

    const th1 = document.createElement('th');
    th1.innerText = 'Title';
    tr.append(th1);

    const orderBy = document.createElement('a');
    orderBy.classList.add('orderBy');
    orderBy.setAttribute('href', '#');
    orderBy.innerHTML = '<i class="fas fa-sort-down"></i>';

    // const SORT_ORDER = {
    //     ASC: 'ASC',
    //     DESC: 'DESC',
    // };
    // const SORT_ORDER_TOGGLE = {
    //     [SORT_ORDER.ASC]: SORT_ORDER.DESC,
    //     [SORT_ORDER.DESC]: SORT_ORDER.ASC,
    // };
    // orderBy.addEventListener('click', () => {
    //         fetch('http://localhost:4000/api/songs',{
    //         order: SORT_ORDER_TOGGLE,
    //     });
    // });


    // orderBy.addEventListener('click', () => {
    //     fetch('http://localhost:4000/api/songs',{
    //         method: 'GET', 
    //         where: 'orderby',
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    //         },
    //     })
    // });

    th1.append(orderBy);

    const th3 = document.createElement('th');
    th3.innerText = 'Kunstner navn';
    tr.append(th3);

    const th4 = document.createElement('th');
    th4.innerText = 'Opdater';
    tr.append(th4);

    const th5 = document.createElement('th');
    th5.innerText = 'Slet';
    tr.append(th5);

    songList.append(tr);

    data.map(function(item, key){

        //liste data
        const wrapper = document.createElement('tr');
        wrapper.classList.add('trData');

        const td1 = document.createElement('td');
        wrapper.append(td1)
        const td2 = document.createElement('td');
        wrapper.append(td2)
        const td3 = document.createElement('td');
        wrapper.append(td3)
        const td4 = document.createElement('td');
        wrapper.append(td4)

        //link til sang detajler
        const link = document.createElement('a');
        link.setAttribute('href', '#');
        link.innerText = item.title;
        link.addEventListener('click', () => {
            getSongDetails(item.id);
        });
        td1.append(link);

        //artist navn
        const artistName = document.createElement('a');
        artistName.innerText = item.artist.name;
        td2.append(artistName);

        //opdater
        const edit = document.createElement('a');
        edit.classList.add('edit');
        edit.innerHTML = '<i class="fas fa-pen"></i>';
        edit.addEventListener('click', () => {
            editSong(item.id)
        });
        td3.append(edit);

        //slet
        const del = document.createElement('a');
        del.classList.add('del');
        del.innerHTML = '<i class="fas fa-trash-alt"></i>'
        del.addEventListener('click', () => {
            //meddelse
            if (confirm(`Vil du slette sangen ${item.title} fra sangbogen?`)) {
                deleteSong(item.id);
            };
        });
        td4.append(del);

        songList.append(wrapper);
    });
};
getSongList();

//åben sang detajler
const getSongDetails = async song_id => {
    reset();

    //tømmer overskriften og derefter
    headLine.innerHTML = '';
    //laver her efter en ny overskrift
    headLine.innerText = 'Sang detajler';

    const data = await myFetch(`http://localhost:4000/api/songs/${song_id}`);

    //detajle wrapper
    const div = document.createElement('div');
    div.classList.add('detailWrapper');

    //tilbage til liste button
    const backBtn = document.createElement('button');
    backBtn.innerText = "Tilbage til liste"
    backBtn.addEventListener('click', () => {
        getSongList();

    })
    div.append(backBtn);
    
    //detajle over skrifter
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

    //tømmer overskriften og derefter
    headLine.innerHTML = '';
    //laver her efter en ny overskrift
    headLine.innerText = 'Opdater en sang';

    const data = await myFetch(`http://localhost:4000/api/songs/${song_id}`);

    //opdater wrapper
    const div = document.createElement('div');
    div.classList.add('editWrapper');

    const form = document.createElement('form');

    //sang id  (hidden)
    const id = document.createElement('input');
    id.setAttribute('type', 'hidden');
    id.setAttribute('name', 'id');
    id.setAttribute('value', data.id);
    form.append(id);

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

    //kunstner navn
    const artistHead = document.createElement('label');
    artistHead.setAttribute('for', 'artist');
    artistHead.innerHTML = 'Kunstner navn';
    form.append(artistHead);

    const select = document.createElement('select');
    select.setAttribute('name', 'artist_id');
    form.append(select);

    const artist = document.createElement('option');
    artist.setAttribute('value', data.artist_id);
    artist.innerText = data.artist.name;
    select.append(artist);

    select.addEventListener('click', async () => {
        const data = await myFetch(`http://localhost:4000/api/songs`);
        data.map(function(item, key){
            const artist = document.createElement('option');
            artist.setAttribute('value', item.artist.id);
            artist.innerText = item.artist.name;
            select.append(artist);
        })
    })

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
    editBtn.addEventListener('click', async () => {
        //bliver lavet på denne måde da det ikke er et rigtigt API
        const params = new URLSearchParams();
        params.append('id', form.id.value);
        params.append('title', form.title.value);
        params.append('artist_id', form.artist_id.value);
        params.append('content', form.content.innerHTML);
        let options = {
            method: 'PUT', 
            body: params,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
        };
        const data = await myFetch(`http://localhost:4000/api/songs`, options);
 
        //meddelese
        if (confirm(`Vil du gemme opdateringen på sangen?`)) {
            getSongList();
        };
    })

    //fortryd button
    const backBtn = document.createElement('button');
    backBtn.innerText = "Fortryd opdatering af sang";
    backBtn.classList.add('regretBtn');
    backBtn.addEventListener('click', () => {
        getSongList();
    })
    form.append(backBtn)

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

    //reloader browser efter sletning
    window.location.reload();
}

//reset funktion
function reset() {
    songList.innerHTML = '';
}

export { search, getSongList, getSongDetails, editSong, deleteSong }


