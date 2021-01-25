import React, { Component } from 'react'

import { Card, CardImg, CardBody, CardText, CardTitle, BreadcrumbItem, Breadcrumb, Button, Modal, ModalHeader, ModalBody, FormGroup, Label, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl'
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        })
    }

    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.name, values.message);
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader>
                        Submit Comment
                    </ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                            <FormGroup>
                                <Row>
                                    <Label md={12} htmlFor="name">Your Name</Label></Row>
                                <Control.text model=".name" id="name" name="name" placeholder="Your Name" className="col-12"
                                    validators={{
                                        minLength: minLength(2),
                                        maxLength: maxLength(15)
                                    }} />
                                <Errors className="text-danger"
                                    model=".name"
                                    show="touched"
                                    messages={{
                                        minLength: 'Must be at least 2 character',
                                        maxLength: 'Must be less than 15 characters'
                                    }} />
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Label md={12} htmlFor="rating">Rating</Label></Row>
                                <Control.select model=".rating" id="rating" name="rating" className="col-12">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                </Control.select>
                            </FormGroup>
                            <FormGroup>
                                <Row>
                                    <Label md={12} htmlFor="message">Your Feedback</Label></Row>
                                <Control.textarea model=".message" id="message" name="message"
                                    rows="6"
                                    className="form-control" />
                            </FormGroup>
                            <Button type="submit" value="submit" color="primary">
                                Submit
                            </Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
                <Button onClick={this.toggleModal} className="m-2" color="primary">
                    Comment
                </Button>
            </div>
        );
    }
}


function RenderDish({ dish }) {
    if (dish !== null && dish !== undefined) {
        return (
            <div className="col-12 col-md-5 m-1" key={dish.id}>
                <FadeTransform in
                    transformProps={{
                        exitTransform: 'scale(0.5) translateY(-50%)'
                    }}>
                    <Card>
                        <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            </div>
        );
    }
    else {
        return (
            <div></div>
        );
    }
}

function RenderComments({ comments, postComment, dishId }) {
    if (comments !== null && comments !== undefined) {
        const newComments = comments.map((comment) => {
            return (
                <div>
                    <Stagger in>
                        <Fade in>
                            <p>{comment.comment}</p>
                            <p>--{comment.author}, {comment.date}</p>
                        </Fade>
                    </Stagger>
                </div>
            );
        });
        return (
            <div className="col-12 col-md-5 m-1">
                <Card>
                    <h4>Comments</h4>
                    {newComments}
                </Card>
                <CommentForm dishId={dishId} postComment={postComment} />
            </div>
        );
    } else {
        return (
            <div></div>
        );
    }
}

function DishDetail(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    else if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <h4>{props.errMess}</h4>
                </div>
            </div>
        );
    }
    return (
        <div className="container">
            <Breadcrumb>
                <BreadcrumbItem>
                    <Link to="/home">Home</Link>
                </BreadcrumbItem>
                <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                <div className="col-12">
                    <h3>{props.dish.name}</h3>
                </div>
            </Breadcrumb>
            <div className="row">
                <RenderDish dish={props.dish} />
                <RenderComments comments={props.comments}
                    postComment={props.postComment}
                    dishId={props.dish.id} />
            </div>
        </div>
    );
}

export default DishDetail;