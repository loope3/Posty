package com.example.post_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController // This means that this class is a Controller
@RequestMapping(path="/demo") // This means URL's start with /demo (after Application path)
public class MainController {
  @Autowired // This means to get the bean called userRepository
         // Which is auto-generated by Spring, we will use it to handle the data
  private PostRepository postRepository;

  @PostMapping(path="/add") // Map ONLY POST Requests
  public @ResponseBody String addNewPost (@RequestBody String post) {
    // @ResponseBody means the returned String is the response, not a view name
    // @RequestParam means it is a parameter from the GET or POST request

    Post n = new Post();
    n.setPost(post);
    postRepository.save(n);
    return String.valueOf(n.getId());
  }

  @GetMapping(path="/allPosts")
  public @ResponseBody Iterable<Post> getAllUsers() {
    // This returns a JSON or XML with the users
    return postRepository.findAll();
  }

  @GetMapping(path="/post/{id}")
  EntityModel<Post> onePost(@PathVariable Integer id) {
    Post post = postRepository.findById(id).get();

    return EntityModel.of(post, 
    linkTo(methodOn(MainController.class).onePost(id)).withSelfRel(),
    linkTo(methodOn(MainController.class).getAllUsers()).withRel("posts"));
  }

  @PutMapping(path="/updatePost/{id}")
  public @ResponseBody String changePost(@PathVariable Integer id, @RequestBody String text) {
    
    postRepository.findById(id).map(post -> {
      post.setPost(text);
      return postRepository.save(post);
    });
    return "Updated\n";
  }

  @DeleteMapping(path="/deletePost/{id}")
  void deletePost(@PathVariable Integer id) {
    postRepository.deleteById(id);
  }

  @GetMapping("/")
  public RepresentationModel<EntityModel<Post>> root() {

    RepresentationModel<EntityModel<Post>> rootResource = new RepresentationModel<EntityModel<Post>>();

    rootResource.add(
      linkTo(methodOn(MainController.class).root()).withSelfRel(),
      linkTo(methodOn(MainController.class).getAllUsers()).withRel("employees"));

    return rootResource;
  }
}