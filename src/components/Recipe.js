import React from "react";
import Markdown from "react-markdown";
import { Image } from "react-datocms"
import gql from "graphql-tag";
import { Query } from "react-apollo";

const recipeQuery = gql`
  query singleRecipe($slug: String!) {
    recipe: recipe(filter: { slug: { eq: $slug } }) {
      id
      slug
      title
      author {
        name
      }
      abstract
      coverImage {
        responsiveImage(imgixParams: { fit: crop, w: 1000, h: 500 }) {
          srcSet
          webpSrcSet
          sizes
          src
          width
          height
          aspectRatio
          alt
          title
          bgColor
          base64
        }
      }
      content {
        ... on TextImageBlockRecord {
          id
          __typename
          image {
            responsiveImage(imgixParams: { fit: crop, ar: "16:9", w: 500 }) {
              srcSet
              webpSrcSet
              sizes
              src
              width
              height
              aspectRatio
              alt
              title
              bgColor
              base64
            }
          }
          text
        }
        ... on TextBlockRecord {
          id
          __typename
          text
        }
      }
    }
  }
`;

const Recipe = props => {
  return (
    <Query query={recipeQuery} variables={{ slug: props.match.params.slug }}>
      {({ data, loading, error }) => {
        if (loading) return "Loading...";
        if (error) return `ERROR: ${error}`;
        const { recipe } = data;
        return (
          <section>
            {recipe && (
              <article>
                <h1 className="Recipe-title">{recipe.title}</h1>
{/*                 <strong>
                  By <Link to={"/about"}>{recipe.author.name}</Link>
                </strong> */}
                  <Image
                    className="Recipe-cover"
                    data={recipe.coverImage.responsiveImage}
                  />
                <Markdown
                  source={recipe.abstract}
                  escapeHtml={false}
                  className="Recipe-abstract"
                />

                {recipe.content.map((block, i) => {
                  if (block.__typename === "TextImageBlockRecord") {
                    return (
                      <div key={block.id} className="Recipe-flag">
                        <Image
                          className="Recipe-flag-image"
                          data={block.image.responsiveImage}
                        />
                        <Markdown
                          source={block.text}
                          className="Recipe-flag-text"
                        />
                      </div>
                    );
                  } else if (block.__typename === "TextBlockRecord") {
                    return (
                      <div key={block.id} className="Recipe-flag">
                        <Markdown
                          source={block.text}
                          className="Recipe-flag-text"
                        />
                      </div>
                    );
                  }
                  return <div key={block.id} />;
                })}
              </article>
            )}
          </section>
        );
      }}
    </Query>
  );
};

export default Recipe;
