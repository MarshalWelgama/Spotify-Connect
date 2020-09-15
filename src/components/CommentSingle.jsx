import React, { Component, useState } from 'react';
import 'fontsource-roboto';
import { Button, Card, Comment, Modal, Header, CommentGroup, Popup, Icon } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import ta from 'time-ago'
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'; 



Date.prototype.customFormat = function(formatString){
    var YYYY,YY,MMMM,MMM,MM,M,DDDD,DDD,DD,D,hhhh,hhh,hh,h,mm,m,ss,s,ampm,AMPM,dMod,th;
    YY = ((YYYY=this.getFullYear())+"").slice(-2);
    MM = (M=this.getMonth()+1)<10?('0'+M):M;
    MMM = (MMMM=["January","February","March","April","May","June","July","August","September","October","November","December"][M-1]).substring(0,3);
    DD = (D=this.getDate())<10?('0'+D):D;
    DDD = (DDDD=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][this.getDay()]).substring(0,3);
    th=(D>=10&&D<=20)?'th':((dMod=D%10)==1)?'st':(dMod==2)?'nd':(dMod==3)?'rd':'th';
    formatString = formatString.replace("#YYYY#",YYYY).replace("#YY#",YY).replace("#MMMM#",MMMM).replace("#MMM#",MMM).replace("#MM#",MM).replace("#M#",M).replace("#DDDD#",DDDD).replace("#DDD#",DDD).replace("#DD#",DD).replace("#D#",D).replace("#th#",th);
    h=(hhh=this.getHours());
    if (h==0) h=24;
    if (h>12) h-=12;
    hh = h<10?('0'+h):h;
    hhhh = hhh<10?('0'+hhh):hhh;
    AMPM=(ampm=hhh<12?'am':'pm').toUpperCase();
    mm=(m=this.getMinutes())<10?('0'+m):m;
    ss=(s=this.getSeconds())<10?('0'+s):s;
    return formatString.replace("#hhhh#",hhhh).replace("#hhh#",hhh).replace("#hh#",hh).replace("#h#",h).replace("#mm#",mm).replace("#m#",m).replace("#ss#",ss).replace("#s#",s).replace("#ampm#",ampm).replace("#AMPM#",AMPM);
  };

var numberr = 5
class CommentSingle extends Component {
    state = {votes:this.props.votes}
    
    
    
    AreYouSure = () => {
        var element = document.getElementById('popupDelete');

        element.style.transform = null;

        confirmAlert({
          title: 'Are you sure to do this?',
          message: `Comments that are deleted can't be undone.`,
          buttons: [
            {
              label: 'Yes',
              onClick: this.handleDeleteClick
            },
            {
              label: 'No',
              onClick:(onclose)
             
            }
          ]
        });
      };
    handleDeleteClick = () => {
        const {renderComments, songId, comment} = this.props
        const commentId = comment._id
        axios.delete('http://localhost:8888/api/comments/', {
             data: { id: commentId } })
          .then(function (response) {
            console.log(response);
            renderComments(songId);
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    deleteHandler = () => { //only see if comment is something user posted
        const {comment, userId} = this.props
       
        if (comment.userId == userId) {
            return (
                <React.Fragment>
                                    <button onClick={this.AreYouSure}
                                            class="ui black basic button">Delete</button>
                                    <button class="ui orange basic button">Report</button>
                </React.Fragment>
            )
        }
        else {
            return(
                <React.Fragment>
                                    <button class="ui orange basic button">Report</button>
                </React.Fragment>
            )
        }
        
    }
    updateVotes() {
        this.setState({votes: this.state.votes + 1}, () => {
            console.log(this.state.votes)
            this.voteHandler = this.voteHandler.bind(this)
        })
    }
    voteHandler = () => {
     
        
        const{votes} = this.state
        const {comment, renderComments, songId} = this.props
        const commentId = comment._id
        console.log(commentId)
        axios.patch('http://localhost:8888/api/comments/vote', {
            
            id: commentId 
          })
          .then(function (response) {
            renderComments(songId)
            console.log(response);

            
          })
          .catch(function (error) {
            console.log(error);
          });
    }
    renderReplies() {
        const {comment, replies} = this.props
        var arr = []
         if(comment.replies.length != 0) { // check reply array length, if > 1 then return comments.
        const commentsReply = comment.replies
        for (var i = 0; i < commentsReply.length; i++) {
        
           arr.push(commentsReply[i])
           const date = new Date(arr[i].dateTime)
           const timeStamp = date.customFormat( "#DD# #MMMM# #YYYY# #hh#:#mm# #AMPM#" );
           const relativeTime = ta.ago(date);
           arr[i].dateTime = relativeTime
           arr[i].timeStamp = timeStamp
         }
           return (
              <CommentGroup>
                   { arr.map(({dateTime, text, timeStamp }) => ( 
                     <React.Fragment>
                    <Comment>
                  <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
                   <Comment.Content>
                     <Comment.Author as='a'>Some random cunt </Comment.Author>
                     <Comment.Metadata>
                     <Popup content={timeStamp} trigger={<span>{dateTime}</span>} />
                     </Comment.Metadata>
                     <Comment.Text>{text}</Comment.Text>
                     <Comment.Actions>
                       <a>Reply</a>
                     </Comment.Actions>
                   </Comment.Content>
                 </Comment>
                 
                  </React.Fragment>  

                  ))}
              </CommentGroup>
          )
        }
       
        
    }
    render() { 
       // https://api.spotify.com/v1/users/12142897666
        const {comment} = this.props
        var date = new Date(comment.dateTime);
        const timeStamp = date.customFormat( "#DD# #MMMM# #YYYY# #hh#:#mm# #AMPM#" );
        const relativeTime = ta.ago(date);
        return ( 
            
            <React.Fragment >
                
            <Card style={{'padding':'15px', 'margin':'5px 5px 10px', 'width':'97%'}}  color="grey">
            <Comment>
              <Comment.Avatar as='a' src={comment.userImage} />
              <Comment.Content>
                <Comment.Author as='a' href={"https://open.spotify.com/user/".concat(comment.userId)}>{comment.userName}</Comment.Author>
                <Comment.Metadata>
                <Popup content={timeStamp} trigger={<span>{relativeTime}</span>} />
                <div>
                <Icon name='utensil spoon icon' />{this.props.comment.votes}
          </div>
                </Comment.Metadata>
                <Comment.Text style={{"margin": "4px 0px 8px 0px"}}>{comment.text}</Comment.Text>
                <Comment.Actions >
                <Button  basic icon onClick={this.voteHandler} size='mini'><Icon name='utensil spoon icon'/></Button>
                <Button basic icon size='mini'><Icon name='reply' /></Button>
                <Popup id="popupDelete"
                    trigger={<Button floated='right' basic icon size='mini' style={{"box-shadow":"0 0 0 1px white inset"}}><Icon name='ellipsis horizontal' /></Button>}
                    content={this.deleteHandler()}
                    on='click'
                    hideOnScroll
                />
                                  
                </Comment.Actions>
                
              </Comment.Content>
              {this.renderReplies()}
              {/* render replies here.  put inside <Coment Group> {all comment rpelies here} </comment group>*/}
              
            </Comment>
            </Card>

            </React.Fragment>
          
         
    
        );
    }
}
 
export default CommentSingle;