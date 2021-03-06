import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import qs from "qs";
import { Image } from "react-datocms"

const RECIPES_PER_PAGE = 20;
const homeQuery = gql`
  query recipes($first: IntType!, $skip: IntType!) {
    meta: _allRecipesMeta {
      count
    }
    recipes: allRecipes(orderBy: position_ASC, first: $first, skip: $skip) {
      id
      title
      slug
      abstract
      coverImage {
        responsiveImage(imgixParams: { fit: crop, crop: faces, w: 500, h: 300 }) {
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

const Home = props => {
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    const skip =
      parseInt(
        qs.parse(props.location.search, { ignoreQueryPrefix: true }).skip,
        10
      ) || 0;
    setSkip(skip);
  }, [props.location.search]);

  return (
    <Query query={homeQuery} variables={{ first: RECIPES_PER_PAGE, skip }}>
      {({ data, loading, error }) => {
        if (loading) return "Loading...";
        if (error) return `ERROR: ${error}`;
        return (
          <section>
            <ul className="Home-ul">
              {data.recipes.map(recipe => (
                <li className="Home-li" key={`recipe-${recipe.id}`}>
                  <Link to={`/recipes/${recipe.slug}`} className="Home-link">
                    <Image
                      className="Home-img"
                      data={recipe.coverImage.responsiveImage}
                    />
                    <div>
                      <h3 className="Home-li-title">{recipe.title}</h3>
                      <p>
                        {recipe.abstract
                          .split(" ")
                          .slice(0, 10)
                          .join(" ")}
                        ...
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {data.meta.count > RECIPES_PER_PAGE && (
              <Link
                className="Home-button"
                to={`?skip=${skip + RECIPES_PER_PAGE}`}
              >
                Mehr Stationen
              </Link>
            )}
          </section>
        );
      }}
    </Query>
  );
};

export default Home;
