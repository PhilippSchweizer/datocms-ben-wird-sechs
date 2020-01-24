import React from "react";
import Markdown from "react-markdown";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { Image } from "react-datocms"

const authorsQuery = gql`
  query authors {
    authors: allAuthors {
      id
      description
      name
      avatar {
        responsiveImage(imgixParams: { fit: crop, crop: faces, w: 300, h: 300 }) {
          aspectRatio
          width
          sizes
          srcSet
          src
          webpSrcSet
          alt
          title
          base64
        }
      }
    }
  }
`;

const Authors = props => {
  return (
    <Query query={authorsQuery}>
      {({ data, loading, error }) => {
        if (loading) return "Loading...";
        if (error) return `ERROR: ${error}`;
        return (
          <section>
            <div className="About-author">
              <div className="About-infoHeader">
                <h2>DAS Geschenk</h2>
                <div>
                  Ben braucht ein neues Fahrrad. Dafür sammeln wir Geld. Beteiligt euch per <a href="https://paypal.me/pools/c/8lSSrGQ6QB">PayPal</a> oder überweist es an DEN Papa (IBAN DE46 2004 1155 0682 3553 00).
                </div>
                <div className="Custom-img-container"></div>
              </div>
            </div>
            <div>
              {data.authors.map(author => (
                <div className="About-author" key={author.id}>
                  <div className="About-infoHeader">
                    <Image
                      className="About-img"
                      data={author.avatar.responsiveImage}
                    />
                    <h2>{author.name}</h2>
                  </div>
                  <Markdown
                    source={author.description}
                    escapeHtml={false}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      }}
    </Query>
  );
};

export default Authors;
