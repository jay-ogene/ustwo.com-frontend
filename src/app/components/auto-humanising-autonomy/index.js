import React, { Component } from 'react';
import Meta from "react-helmet";
import firebase from 'firebase';
import ReactFire from 'reactfire';
import reactMixin from 'react-mixin';
import window from 'app/adaptors/server/window';
import ScrollWrapper from 'app/components/scroll-wrapper';
import Hero from 'app/components/hero';
import Signup from 'app/components/signup';
import ContactBlockAuto from 'app/components/contact-block-auto';
import Footer from 'app/components/footer';
import AutoWhatwedo from 'app/components/auto-whatwedo';
import VideoBlock from 'app/components/video-block';
import ArticlePreview from 'app/components/article-preview';
import kebabCase from 'lodash/string/kebabCase';

function validateEmail(email) {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function handleInputChange(component, input) {
  return (event) => {
    const payload = Object.assign({}, component.state.payload);
    payload[input] = event.target.value;
    component.setState({ payload });
  };
}

function handleClick(component) {
  return (event) => {
    event.preventDefault();

    component.setState({ status: 'sending' });

    if (validateEmail(component.state.payload.email)) {
      component.firebaseRefs.signup.push(component.state.payload, (error) => {
        if (error) {
          component.setState({
            status: 'error',
            errorMessage: error,
          });
          return;
        }
        component.setState({ status: 'success' });
      });
    } else {
      component.setState({
        status: 'error',
        errorMessage: 'You must enter a valid email address',
      });
    }
  };
}

const config = {
  apiKey: "AIzaSyDkme6lbAz0ITTeY463TR5J9XLn6XqK7hI",
  authDomain: "auto-book-2.firebaseapp.com",
  databaseURL: "https://auto-book-2.firebaseio.com",
  projectId: "auto-book-2",
  storageBucket: "auto-book-2.appspot.com",
  messagingSenderId: "415950089629"
};

firebase.initializeApp(config);

class HumanisingAutonomy extends Component {

  constructor(props) {
    super(props);

    this.state = {
      payload: {
        email: '',
        name: '',
        company: '',
      },
      status: 'ready',
      errorMessage: '',
    };
  }

  componentWillMount() {
    firebase.auth().signInAnonymously().catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });

    this.firebaseRef = firebase.database().ref('signup');
    this.bindAsArray(this.firebaseRef, 'signup');
  }

  componentWillUnmount() {
    this.firebaseRef.off();
  }

  renderAuthors(authors) {
    return authors.map(author => {
      return (
        <li key={kebabCase(author.name)}>
          <div className="author-image">
            <img src={author.imageUri} alt={`Photo of ${author.name}`} />
          </div>
          <div className="author-details">
            <h5>{author.name}</h5>
            <p>{author.occupation}</p>
          </div>
        </li>
      )
    });
  }

  render() {
    const { page, documentScrollPosition, viewportDimensions, footer, studios, currentPage, isMobile, fixedHeight, scrollProgress } = this.props;
    const { payload, status, errorMessage } = this.state;

    let styles;
    if (documentScrollPosition > window.innerHeight + 100) {
      styles = { position: `relative` }
    }

    let showcaseVideoSrc;
    if (window.innerWidth < 600) {
      showcaseVideoSrc = 'https://player.vimeo.com/external/235923198.sd.mp4?s=810f877f1133af83ddcd75dfe46c5702f15b4c14&profile_id=164';
    } else {
      showcaseVideoSrc = 'https://player.vimeo.com/external/235923198.sd.mp4?s=810f877f1133af83ddcd75dfe46c5702f15b4c14&profile_id=165';
    }
    const showcaseVideoPoster = 'https://i.vimeocdn.com/video/657875722.jpg?mw=960&mh=540';

    let additionalVideoSrc;
    if (window.innerWidth < 600) {
      additionalVideoSrc = 'https://player.vimeo.com/external/230365343.sd.mp4?s=dd1580c0465d3ad4b8361916a217276b255a921c&profile_id=164';
    } else {
      additionalVideoSrc = 'https://player.vimeo.com/external/230365343.sd.mp4?s=dd1580c0465d3ad4b8361916a217276b255a921c&profile_id=165';
    }
    const additionalVideoPoster = 'https://i.vimeocdn.com/video/652407905.jpg?mw=960&mh=540';

    return (
      <div className="page-auto page-auto-humanising-autonomy page-case-study">

        <Meta
          meta={[{
            name: 'robots',
            content: 'noindex'
          }]}
        />

        <div className="page-content-wrapper">

          <section className="single-column intro">
            <div className="wrapper">
              <div className="section-title">Research Project</div>
              <h1 className="title">
                Humanising Autonomy
                <div className="subtitle">Where are we going?</div>
              </h1>
              <div className="content">
                <p>In our latest book, we explore creating a human approach to autonomy that actually works.<br />The auto industry's approach to autonomy is imbalanced – we need to focus on the human factors involved rather than solely on technical challenges.</p>
              </div>
            </div>
          </section>

          <img src="/images/auto/humanising-autonomy-book-cover.jpg" className="rimage showcase-image" />

          <section className="single-column humanising-autonomy-form">
            <div className="wrapper">

              <h4>Humanising Autonomy is out now</h4>
              <p>Fill in this form to get your free copy - don't worry your details are safe with us:</p>

              <Signup
                onNameInput={handleInputChange(this, 'name')}
                onCompanyInput={handleInputChange(this, 'company')}
                onEmailInput={handleInputChange(this, 'email')}
                onSubmit={handleClick(this)}
                payload={payload}
                status={status}
                errorMessage={errorMessage}
              />
            </div>
          </section>

          <div className="showcase-video video">
            <VideoBlock
              videoPoster={showcaseVideoPoster}
              src={showcaseVideoSrc}
            />
          </div>

          <section className="humanising-autonomy-article">
            <div className="wrapper">
              <ArticlePreview data={autoHumanisingAutonomyData.article1} />
            </div>
          </section>

          <section className="humanising-autonomy-article humanising-autonomy-extra-video">
            <div className="wrapper">
              <VideoBlock
                videoPoster={additionalVideoPoster}
                src={additionalVideoSrc}
              />
            </div>
          </section>

          <section className="humanising-autonomy-article">
            <div className="wrapper">
              <ArticlePreview data={autoHumanisingAutonomyData.article2} alignright />
            </div>
          </section>

          <section className="humanising-autonomy-article">
            <div className="wrapper">
              <ArticlePreview data={autoHumanisingAutonomyData.article3} />
            </div>
          </section>

          <section className="humanising-autonomy-contributors">
            <div className="wrapper">
              <div className="ha-contributors-authors">
                <div className="section-title">Authors</div>
                <ul>
                  {this.renderAuthors(autoHumanisingAutonomyData.authors)}
                </ul>
              </div>
              <div className="ha-contributors-acknowlegments">
                <div className="section-title">Acknowlegments</div>
                <p>{autoHumanisingAutonomyData.acknowlegments.intro}</p>
                <p>{autoHumanisingAutonomyData.acknowlegments.main}</p>
              </div>
            </div>
          </section>

          <ScrollWrapper
            component={<ContactBlockAuto />}
            documentScrollPosition={documentScrollPosition}
            viewportDimensions={viewportDimensions}
            requireScreenPosition={true}
            className="scroll-wrapper-contact-block"
          />
          <Footer data={footer} studios={studios} currentPage={currentPage}/>

        </div>
      </div>
    )
  }
}

reactMixin(HumanisingAutonomy.prototype, ReactFire);

export default HumanisingAutonomy;

const autoHumanisingAutonomyData = {
  title: 'Auto',
  subtitle: 'Humanising Autonomy',
  intro: "The auto industry's approach to autonomy is imbalanced – there is too much focus on discrete technologies, with little regard for the powerful human factors involved. In our latest book, we explore creating a human approach to autonomy that actually works.",
  article1: {
    title: 'Introducting the ustwo Roo',
    author: 'Fast Co',
    excerpt: 'Looking beyond opportunities to optimize, ustwo’s AV concept is the built on the foundational idea that there’s more to people’s mobility needs than simply the vehicle and its technology.',
    uri: '/',
    image: '/images/auto/auto-roo.jpg'
  },
  article2: {
    title: 'People and Driverless Vehicles',
    subtitle: 'What Does Autonomy Mean to You?',
    excerpt: 'In order to overcome the barriers to AV adoption, they need to be truly accessible to everyone. The way to do this? Observe what people’s mobility wants and needs are. This is the key to creating a human approach to autonomy that actually works.',
    uri: '/',
    image: '/images/auto/article-driverless-vehicles.jpg'
  },
  article3: {
    title: 'Humanising Autonomy',
    subtitle: 'Where Are We Going?',
    excerpt: 'Autonomous Vehicles promise to make a meaningful difference to the world, enabling a new level of mobility, independence and safety for all. Yet discussions continue to focus on topics such as technological feasibility and its impact to our roads, rather than the needs of the user.',
    uri: '/',
    image: '/images/auto/article-humanising-autonomy.jpg'
  },
  authors: [{
    name: 'Tim Smith',
    occupation: 'Design Principal',
    imageUri: '/images/auto/tim-smith.jpg'
  },{
    name: 'Harsha Vardhan',
    occupation: 'Interaction Lead',
    imageUri: '/images/auto/harsha-vardhan.jpg'
  },{
    name: 'Dem Gerolemou',
    occupation: 'Visual Designer',
    imageUri: '/images/auto/harsha-vardhan.jpg'
  },{
    name: 'Cesar',
    occupation: 'Interaction Lead',
    imageUri: '/images/auto/harsha-vardhan.jpg'
  },{
    name: 'Harper',
    occupation: 'Interaction Lead',
    imageUri: '/images/auto/harsha-vardhan.jpg'
  },{
    name: 'Kota Kobayashi',
    occupation: 'Interaction Lead',
    imageUri: '/images/auto/harsha-vardhan.jpg'
  },{
    name: 'Lars Rosengren',
    occupation: 'Interaction Lead',
    imageUri: '/images/auto/harsha-vardhan.jpg'
  },{
    name: 'Michelle Constante',
    occupation: 'Interaction Lead',
    imageUri: '/images/auto/harsha-vardhan.jpg'
  },{
    name: 'Rob Penny',
    occupation: 'Product Designer',
    imageUri: '/images/auto/harsha-vardhan.jpg'
  },{
    name: 'Tom Harle',
    occupation: 'Strategy Principle',
    imageUri: '/images/auto/harsha-vardhan.jpg'
  }],
  acknowlegments: {
    intro: 'Lorem ipsum blah blah blah etc whatever',
    main: 'Consectetur adipiscing elit. In et neque nulla. Vestibulum ac euismod quam, vel egestas sapien.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et neque nulla. Vestibulum ac euismod quam, vel egestas sapien.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et neque nulla. Vestibulum ac euismod quam, vel egestas sapien.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et neque nulla. Vestibulum ac euismod quam, vel egestas sapien.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et neque nulla. Vestibulum ac euismod quam, vel egestas sapien.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et neque nulla. Vestibulum ac euismod quam, vel egestas sapien.Lorem ipsum dolor sit amet, consectetur adipiscing elit. In et neque nulla. Vestibulum ac euismod quam, vel egestas sapien.'
  }
}
