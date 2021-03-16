var postLocation = 0; //used to determine which box to post the blog to
function addBlog(){
    var title = document.getElementById("title").value;
    var article = document.getElementById("article").value;
    var image = document.getElementById("image").files[0].name;
    // console.log(title);
    // console.log(article);
    // console.log(imageInfo);
    document.getElementById("titleInfo"+String(postLocation)).innerHTML=title;
    document.getElementById("articleInfo"+String(postLocation)).innerHTML=article;
    document.getElementById("imageInfo"+String(postLocation)).src=image;
    postLocation = (postLocation + 1)%3
    resetFields();
}

function resetFields(){
    document.getElementById("title").value="";
    document.getElementById("article").value="";
    document.getElementById("image").value="";
}
