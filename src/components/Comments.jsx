import React, { Component } from "react";
import CommentSingle from "./CommentSingle";
import { Header, Comment } from "semantic-ui-react";
class Comments extends Component {
  state = {};
  renderComments() {
    const { comments, userId, isReplying } = this.props;
    var prettyComments = [];
    for (var i = 0; i < comments.length; i++) {
      if (comments[i].level == 0) {
        prettyComments.push(comments[i]);
      }
    }

    return (
      <React.Fragment>
        {prettyComments.map((comment) => (
          <CommentSingle
            isReplying={isReplying}
            comment={comment}
            userId={userId}
            renderComments={this.props.renderComments}
            songId={this.props.songId}
            getReplyInfo={this.props.getReplyInfo}
          />
        ))}
      </React.Fragment>
    );
  }
  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          "text-align": "center",
          backgroundColor: "rgb(252, 252, 252)",
        }}
      >
        <Comment.Group style={{ width: "100%" }} threaded>
          <Header as="h3" dividing>
            All Comments
          </Header>
          <div style={{ "text-align": "start" }}>{this.renderComments()}</div>
        </Comment.Group>
      </div>
    );
  }
}

export default Comments;
