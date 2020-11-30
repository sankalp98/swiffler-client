import React, { useState, useEffect } from 'react'
import { Button, Icon, Label, Popup } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import {useMutation} from '@apollo/client'
import gql from 'graphql-tag'


function LikeButton(props){
    const {id, likes, likesCount} = props.post
    const user = props.user
    let [liked, setLiked] = useState(false)

    useEffect(() => {
        if(user && likes.find(like => like.username === user.username)){
            setLiked(true)
        } else {
            setLiked(false)
        }
    }, [user, likes])

    const [likePost] = useMutation(LIKE_POST_MUTATION, {
        variables: {postId: id},
      });

    const likeButton = user ? (
         liked ? (
             <Button color="teal">
                 <Icon name="heart"/>
             </Button>
         ) : (
            <Button color="teal" basic>
                <Icon name="heart"/>
            </Button>
         )
    ) : (
        <Button color="teal" basic as={Link} to="/login">
            <Icon name="heart"/>
        </Button>
    )

    return (
        <Popup content={liked ? "Unlike" : "Like"} inverted trigger={
            <Button as='div' labelPosition='right' onClick={likePost}>
            {likeButton}
            <Label basic color='teal' pointing='left'>
                {likesCount}
            </Label>
            </Button>
        }/>
    )
}

const LIKE_POST_MUTATION = gql `
    mutation likePost($postId: ID!){
        likePost(postId: $postId){
            id
            likes{
                id
                username
            }
            likesCount
        }
    }
`

export default LikeButton
