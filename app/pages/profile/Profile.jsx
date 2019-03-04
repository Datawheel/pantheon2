import React from "react";
import {Link} from "react-router";

/*
 * Note: This is kept as a container-level component,
 *  i.e. We should keep this as the container that does the data-fetching
 *  and dispatching of actions if you decide to have any sub-components.
 */
const Profile = ({children}) => {
  const sampleProfiles = [
    {type: "person", slug: "wendy_carlos"},
    {type: "person", slug: "katie_couric"},
    {type: "person", slug: "nostradamus"},
    {type: "person", slug: "mikhail_bulgakov"},
    {type: "place", slug: "jefferson_valley-yorktown"},
    {type: "place", slug: "paris"},
    {type: "place", slug: "argentina"},
    {type: "place", slug: "australia"},
    {type: "occupation", slug: "architect"},
    {type: "occupation", slug: "geologist"},
    {type: "occupation", slug: "occultist"},
    {type: "occupation", slug: "musician"}
  ];

  return (
    <div className="profile">
      {
        !children
          ? <ul>

            {sampleProfiles.map(profile =>
              <li key={profile.slug}>
                <Link
                  to={`/profile/${profile.type}/${profile.slug}`}
                  className="item"
                  activeClassName="active">
                  {profile.slug}
                </Link>
              </li>
            )}

          </ul>
          : null
      }
      <div>{children}</div>
    </div>
  );
};

export default Profile;
