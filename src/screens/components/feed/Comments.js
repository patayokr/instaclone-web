import PropTypes from "prop-types";
import styled from "styled-components";

import Comment from "./Comment";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import useUser from "../../../hooks/useUser";
const CREATE_COMMENT_MUTATION = gql`
  mutation createComment($photoId: Int!, $payload: String!) {
    createComment(photoId: $photoId, payload: $payload) {
      ok
      id
      error
    }
  }
`;
const CommentContainer = styled.div`
  margin-top: 20px;
`;

const PostCommentContainer = styled.div`
  margin-top: 10px;
  padding-top: 15px;
  padding-bottom: 10px;
  border-top: 1px solid ${(props) => props.theme.borderColor};
`;

const PostCommentInput = styled.input`
  width: 100%;
  &::placeholder {
    font-size: 12px;
  }
`;

const CommentCount = styled.span`
  opacity: 0.7;
  margin: 10px 0px;
  font-size: 10px;
  display: block;
  font-weight: 600;
`;
function Comments({ photoId, author, caption, commentNumber, comments }) {
  const { data: userData } = useUser();
  const createCommentUpdate = (cache, result) => {
    const {
      data: {
        createComment: { ok, id },
      },
    } = result;
    if (ok && userData?.me) {
      const { payload } = getValues();
      setValue("payload", "");
      const newComment = {
        __typename: "Comment",
        createdAt: Date.now(),
        payload,
        id,
        isMine: true,
        user: {
          ...userData.me,
        },
      };

      const newCacheComment = cache.writeFragment({
        data: newComment,
        fragment: gql`
          fragment BSName on Comment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
      });

      cache.modify({
        id: `Photo:${photoId}`,
        fields: {
          comments(prev) {
            return [...prev, newCacheComment];
          },
          commentNumber(prev) {
            return prev + 1;
          },
        },
      });
    }
  };
  const [createCommentMutation, { loading }] = useMutation(
    CREATE_COMMENT_MUTATION,
    { update: createCommentUpdate }
  );
  const { register, handleSubmit, setValue, getValues } = useForm();
  const onValid = (data) => {
    const { payload } = data;

    if (loading) {
      return;
    }

    createCommentMutation({
      variables: {
        photoId,
        payload,
      },
    });
  };

  return (
    <CommentContainer>
      <Comment author={author} payload={caption} />
      <CommentCount>
        {commentNumber === 1 ? "1 comment" : `${commentNumber} comments`}
      </CommentCount>
      {comments?.map((comment) => (
        <Comment
          key={comment.id}
          id={comment.id}
          photoId={photoId}
          author={comment.user.username}
          payload={comment.payload}
          isMine={comment.isMine}
        />
      ))}
      <PostCommentContainer>
        <form onSubmit={handleSubmit(onValid)}>
          <PostCommentInput
            name="payload"
            {...register("payload", { required: true })}
            type="text"
            placeholder="Write a comment...."
          />
        </form>
      </PostCommentContainer>
    </CommentContainer>
  );
}

Comment.propTypes = {
  photoId: PropTypes.number,
  author: PropTypes.string.isRequired,
  caption: PropTypes.string,
  commentNumber: PropTypes.number,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      user: PropTypes.shape({
        avatar: PropTypes.string,
        username: PropTypes.string.isRequired,
      }),
      payload: PropTypes.string.isRequired,
      isMine: PropTypes.bool.isRequired,
      createdAt: PropTypes.string.isRequired,
    })
  ),
};

export default Comments;
