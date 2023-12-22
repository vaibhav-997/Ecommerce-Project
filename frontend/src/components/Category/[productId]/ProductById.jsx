import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Star } from "lucide-react";
import axios from "axios";
import { useTheme } from "../../themeProvider";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

function ProductById() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [fetchedComments, setFetchedComments] = useState(null);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const user = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedComment, setEditedComment] = useState("");


  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        let res = await axios.get(`/api/v1/product/product/${id}`);

        setProduct(res.data.payload);
        setImages(res.data.payload.productImage);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const getComments = async () => {
      setLoading(true);
      let res = await axios.get(`/api/v1/product/comments/${id}`);

      if (res.data.success === true) {
        setFetchedComments(res.data.payload);
      }
      setLoading(false);
    };

    getComments();
    getProduct();
  }, [id]);

  const changeImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (!product || !images) {
    return <p>Loading...</p>;
  }

  const handleDelete = async () => {
    let res = await axios.delete(`/api/v1/product/delete-product/${id}`);
    toast({
      description: res.data.message,
    });
    if (res.data.success === true) {
      navigate("/");
    }
  };

  const hanldeAddComment = async () => {
    let res = await axios.post(`/api/v1/product/comment/${id}`, { comment });

    toast({
      description: res.data.message,
    });
  };


  const handleUpdateComment = (commentId, currentComment) => {
    setEditingCommentId(commentId);
    setEditedComment(currentComment);
  };


  const handleSaveComment = async (commentId) => {
    // Perform the save/update logic here
    // You may use axios.put to update the comment on the server

    setEditingCommentId(null);
    setEditedComment("");

    // Add any additional logic you need after saving the comment
  };

  return (
    <div>
      <section className="overflow-hidden">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <div className="mx-auto flex flex-wrap items-center lg:w-4/5">
            <div className="flex flex-col items-center w-full lg:w-1/2">
              <img
                alt="Product"
                className=" w-full rounded object-cover h-auto  mb-4"
                src={images[currentImageIndex]}
              />

              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <img
                    key={index}
                    alt={`Thumbnail ${index}`}
                    className={`h-16 w-16 cursor-pointer ${
                      currentImageIndex === index
                        ? "border-2 border-blue-500"
                        : ""
                    }`}
                    src={image}
                    onClick={() => changeImage(index)}
                  />
                ))}
              </div>
            </div>
            <div className="mt-6 w-full lg:mt-0 lg:w-1/2 lg:pl-10 p-2">
              <h2 className="text-sm font-semibold tracking-widest text-gray-500">
                {product.productCompany}
              </h2>
              <h1
                className={`my-4 text-3xl font-semibold ${
                  theme === "dark" ? "text-white" : "text-black"
                } `}
              >
                {product.productName}
              </h1>
              <div className="my-4 flex items-center">
                <span className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-500" />
                  ))}
                  <span className="ml-3 inline-block text-xs font-semibold">
                    4 Reviews
                  </span>
                </span>
              </div>
              <p className="leading-relaxed">{product.productDetails}</p>

              <div className="flex items-center justify-between">
                <span
                  className={`title-font text-xl font-bold ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  ₹{product.productPrice}
                </span>
                <button
                  type="button"
                  className="rounded-md mt-3 bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                >
                  Add to Cart
                </button>
                {user?.role === "ADMIN" && (
                  <>
                    <button
                      onClick={() => navigate(`/update-product/${product._id}`)}
                      type="button"
                      className="rounded-md mt-3 bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      Update
                    </button>
                    <button
                      onClick={handleDelete}
                      type="button"
                      className="rounded-md mt-3 bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl  px-5 py-10">
          <label htmlFor="comment">Comment</label>
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={"Add your comment"}
            id={"comment"}
          />
          <Button onClick={hanldeAddComment} className="my-2">
            Add Comment
          </Button>
          <hr />
        </div>

        <div className="mx-auto max-w-5xl px-3 py-2">
        {fetchedComments.map((comment) => (
          <div key={comment._id}>
            {editingCommentId === comment._id ? (
              <div className="flex gap-2">
                <span>
                  <Avatar>
                    <AvatarImage className="cursor-pointer" src={user.avatar} />
                    <AvatarFallback>{user?.username}</AvatarFallback>
                  </Avatar>
                </span>
                <Input
                  value={editedComment}
                  onChange={(e) => setEditedComment(e.target.value)}
                />
                <Button onClick={() => handleSaveComment(comment._id)}>Save</Button>
              </div>
            ) : (
              <p className="flex gap-2">
                <span>
                  <Avatar>
                    <AvatarImage className="cursor-pointer" src={user.avatar} />
                    <AvatarFallback>{user?.username}</AvatarFallback>
                  </Avatar>
                </span>
                {comment.comments}
                {comment.user.username === user.username && (
                  <div className="space-x-5">
                    <Button onClick={() => handleUpdateComment(comment._id, comment.comments)}>
                      Update
                    </Button>
                    <Button>Delete</Button>
                  </div>
                )}
              </p>
            )}
          </div>
        ))}
      </div>
      </section>
    </div>
  
  );
}

export default ProductById;
