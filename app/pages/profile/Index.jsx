import React from 'react';
import { Link } from 'react-router';

/*
 * Note: This is kept as a container-level component,
 *  i.e. We should keep this as the container that does the data-fetching
 *  and dispatching of actions if you decide to have any sub-components.
 */
const Profile = ({children}) => {
  const sampleProfiles = [
    {type:"person", slug:"Wendy_Carlos"},
    {type:"person", slug:"Katie_Couric"},
    {type:"person", slug:"Nostradamus"},
    {type:"person", slug:"Mikhail_Bulgakov"},
    {type:"place", slug:"Jefferson_Valley-Yorktown"},
    {type:"place", slug:"Paris"},
    {type:"place", slug:"Argentina"},
    {type:"place", slug:"Australia"},
    {type:"domain", slug:"architect"},
    {type:"domain", slug:"geologist"},
    {type:"domain", slug:"occultist"},
    {type:"domain", slug:"musician"},
  ];

  return (
    <div className='profile'>
    {
      !children
      ? <ul>

        {sampleProfiles.map((profile) =>
          <li>
            <Link
              to={`/profile/${profile.type}/${profile.slug}`}
              key={profile.slug}
              className="item"
              activeClassName="active">
              {profile.slug}
            </Link>
          </li>
        )}

      </ul>
      : null
    }
    {children}
    </div>
  )
};

export default Profile;
