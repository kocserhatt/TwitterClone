const SUPASE_URL ="https://xkrmjdmuxebgqqvuxrth.supabase.co";
const SUPASE_ANON_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhrcm1qZG11eGViZ3FxdnV4cnRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNTg1NTIsImV4cCI6MjAzMDczNDU1Mn0.ay2DR3nKfsrLJYKBETJLMsy21XGZvzB1Ny2HaPfvvPY"
const form = document.querySelector("#form");
let x;




const _supabase = supabase.createClient(SUPASE_URL, SUPASE_ANON_KEY);

async function getData(){
    const { data, error } = await _supabase.from('twitter-clone').select()
    if(error){
        return []
    }
    return data;
}



async function renderData(){
    const data = await getData();
    const tweet = document.querySelector(".containerTweetUpdates")
    tweet.innerHTML=""
    data.forEach(items => {
        tweet.innerHTML +=
        `
        <div class="containerTweetUpdate" data-commentid="${items.id}">
            <div class="tweetUser">
                <img src="assets/image/users1.svg">
                <p>@ronny_silva</p>
                <p>${items.created_at}</p>
                <button id="delete-btns">SİL</button>
            </div>
            <p class="tweet-p">${items.kullanici_yorum}</p>
            <button><img src="assets/image/retweet.svg"></button>
            <button id="${items.id}" name="like" class="likeBtns"><img src="assets/image/like.svg">${items.like}</button>
            <div class="buttons">
                <img src="assets/image/image.svg">
                <img src="assets/image/chart.svg">
                <img src="assets/image/emoji.svg">
                <img src="assets/image/time.svg">
                <img src="assets/image/location.svg">
            </div>
        </div>`
        deleteComment();
        likeBtns();
    });
}


async function formDatas(e){
    e.preventDefault();
    const formData = new FormData(e.target)
    const formObj = Object.fromEntries(formData)
    const { data, error } = await _supabase.from('twitter-clone').insert([ {kullanici_yorum: formObj.comments, like: 0}]).select();
    renderData();
    form.reset();
}

async function deleteComment() {
    const deleteBtn = document.querySelectorAll("#delete-btns");
    for (const btn of deleteBtn) {
        btn.addEventListener("click", async function(){
            const { error } = await _supabase.from('twitter-clone').delete().eq("id", Number(this.parentElement.parentElement.dataset.commentid));
            return renderData();
        })
    }
}
async function likeBtns(){
    const likeBtns = document.querySelectorAll(".likeBtns");
    for (const likeBtn of likeBtns) {
        likeBtn.addEventListener("click", async function(){
            const datas = await getData();
            x = datas.find(d => d.id==this.id).like;
            x ++;
            console.log(this.parentElement.dataset.commentid);
            const { data, error } = await _supabase
                .from('twitter-clone')
                .update({ like: x })
                .eq('id', Number(this.parentElement.dataset.commentid));
                return renderData();
            })
        }
}



form.addEventListener("submit",formDatas);
renderData();