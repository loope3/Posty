import 'bootstrap/dist/css/bootstrap.css';
import React, { useEffect } from 'react';
import ReactDom from 'react-dom';

//fetch get request to get all posts in database and updates page
const LoadData  = (updateData) => {
  useEffect(() => {
    const POSTS_REST_API = '/demo/allPosts';
    fetch(POSTS_REST_API,{ 
                method: 'get',
                    headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    },
                    'credentials': 'same-origin'
            })
            .then(res => res.json())
            .then(post => {
              updateData(post);
            })
            .catch((err) => {
              console.log(err.message);
            }); 
  }, []);
}

//fetch request to get data and returns id of new data
const AddData = async (addedData) => {
  const POSTS_REST_API = '/demo/add';
  const response = await fetch(POSTS_REST_API,{ 
              method: 'POST',
              body: addedData
          })
          .catch((err) => {
            console.log(err.message);
          }); 
  const data = await response.json();
  console.log(data);
  return data;
}

//loads the webpage
function PostList() {
  const [addText, newText] = React.useState('');
  const [posts, setPosts] = React.useState([]);

  //makes fetch request to get data
  LoadData(setPosts);

  //removes a post
  const removePost = (id) => {
    //delete from database
    const POSTS_REST_API = '/demo/deletePost/' + id;
    fetch(POSTS_REST_API,{ 
                method: 'DELETE',
            })
            .catch((err) => {
              console.log(err.message);
            }); 
    //update page
    let newPostsList = posts.filter((post) => post.id !== id);
    setPosts(newPostsList);
  }
  
  //handles change when inserting text data
  const handleChange = (input) => {
    newText(input.target.value);
  }

  //function to add posts
  const addPost = () => {
    let text = addText;
    //addData makes a fetch request and returns the new ID of post from database
    const newID = AddData(text);
    console.log(newID);
    const newData = posts.concat({id: newID, post: addText})
    setPosts(newData);
    
    newText('');
  }

  //function to edit posts
  const editPost = (id) => {

    const POSTS_REST_API = '/demo/updatePost/' + id;
    fetch(POSTS_REST_API,{ 
                method: 'PUT',
                    body:addText
            })
            .then(res => console.log(res))

            .catch((err) => {
              console.log(err.message);
            }); 
    //load updated post list
    const newPostsList = posts.map((post) => {
      if (post.id === id) {
        const updatedList = {
          ...post,
          post: addText
        }
        return updatedList;
      }
      return post;
    })
    setPosts(newPostsList);
  }

  return (
    <div class="container border"> 
      <div class=" row justify-content-center border">
          <div class="form-outline mb-4 mt-3">
            <textarea class="form-control" id="form6Example7" rows="4" 
              placeholder="Enter a Message" onChange={input => handleChange(input)}>
            </textarea>
          </div>
          <div class="row mb-3">
            <button type="button" class="btn btn-primary btn-lg btn-block" onClick={addPost}>
              Submit
            </button>
          </div>
      </div>
      {posts.map((text) => {
        return (
          <div class="container bg-info my-4 border" key={text.id}>
            <div class="row justify-content-center">
              <div class="form-outline">
                <h3 class="text-center mt-3">{text.post}</h3>
                <div class="row justify-content-center">
                  <div class="input-group">
                    <input type="text" class="form-control" placeholder="Edit message" 
                    onChange={input => handleChange(input)} aria-describedby="inputGroup-sizing-default"/>
                  </div>
                </div>
                <div class="row justify-content-center">
                  <div class="col text-center">
                    <button type='button' class="p-1 btn bg-light m-2" onClick={() => editPost(text.id)}>
                    edit
                    </button>
                    <button type="button" class="btn btn-danger btn-sm" onClick={() => removePost(text.id)}>
                    delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

ReactDom.render(<PostList />, document.getElementById('root'));