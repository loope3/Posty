package com.example.post_app;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.sql.Timestamp;

@Entity // This tells Hibernate to make a table out of this class
public class Post {
 
  @Id
  @GeneratedValue(strategy=GenerationType.AUTO)
  private Integer id;

  private String post;

  @UpdateTimestamp
  @Column
  private Timestamp modifiedDate;

  @CreationTimestamp
  @Column
  private Timestamp createdDate;
  
  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getPost() {
    return post;
  }

  public void setPost(String post) {
    this.post = post;
  }

  public Timestamp getCreatedDate() {
    return this.createdDate;
  }

  public Timestamp getModifiedDate() {
    return this.modifiedDate;
  }

}