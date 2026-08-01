import Post from "../models/Post.js";


// GET ALL POSTS
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name username")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE POST BY SLUG
export const getPostBySlug = async (req, res) => {
  try {

    const post = await Post.findOne({
      slug: req.params.slug
    })
    .populate("author", "name username");


    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }


    post.views += 1;
    await post.save();


    res.json(post);


  } catch(error){
    res.status(500).json({
      message:error.message
    });
  }
};



// CREATE POST
export const createPost = async(req,res)=>{
  try{

    const post = await Post.create({
      ...req.body,
      author:req.user.id
    });


    res.status(201).json(post);


  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};



// UPDATE POST
export const updatePost = async(req,res)=>{

try{

const post = await Post.findByIdAndUpdate(
req.params.id,
req.body,
{
new:true
}
);


res.json(post);


}catch(error){

res.status(500).json({
message:error.message
});

}

};



// DELETE POST
export const deletePost = async(req,res)=>{

try{

await Post.findByIdAndDelete(req.params.id);


res.json({
message:"Post deleted"
});


}catch(error){

res.status(500).json({
message:error.message
});

}

};



// LIKE POST
export const likePost = async(req,res)=>{

try{

const post = await Post.findById(req.params.id);


const alreadyLiked = post.likes.includes(req.user.id);


if(alreadyLiked){

post.likes =
post.likes.filter(
(id)=>id.toString() !== req.user.id
);

}
else{

post.likes.push(req.user.id);

}


post.likesCount = post.likes.length;


await post.save();


res.json(post);


}catch(error){

res.status(500).json({
message:error.message
});

}

};



// FEATURED POSTS
export const getFeaturedPosts = async(req,res)=>{

try{

const posts = await Post.find({
featured:true
})
.populate("author","name username");


res.json(posts);


}catch(error){

res.status(500).json({
message:error.message
});

}

};



// GET TAGS
export const getTags = async(req,res)=>{

try{

const tags = await Post.distinct("tags");

res.json(tags);


}catch(error){

res.status(500).json({
message:error.message
});

}

};



// GET CATEGORIES
export const getCategories = async(req,res)=>{

try{

const categories = await Post.distinct("category");

res.json(categories);


}catch(error){

res.status(500).json({
message:error.message
});

}

};