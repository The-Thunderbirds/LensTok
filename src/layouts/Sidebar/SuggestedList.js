import React, { useEffect, useState } from "react";
import ListAccount from "~/features/accounts/components/ListAccount";
import { getUsersService } from "~/features/accounts/services/getUsersService";
import { useApolloProvider } from "~/context/ApolloContext";

function SuggestedList() {
  const [perpage, setPerpage] = useState(5);
  const [suggestedList, setSuggestedList] = useState([]);
  const { explorePublications } = useApolloProvider();
  const [loading, setLoading] = useState(false);
 
  useEffect(() => {
    fetchPublications();
  }, []);


  const handleSeeMore = () => {
    if (perpage != 20) {
      setPerpage((prev) => prev + 5);
    } else {
      setPerpage(5);
    }
  };

  async function fetchPublications() {
    setLoading(true);
    let response = await explorePublications();
    console.log("RESPONSE",response)
    let items = response.data.explorePublications.items;
    console.log("ITEMS",items);
    let usersList = []
    let userIds = []
    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      let new_user = {
        id : item.profile.id,
        handle: item.profile.handle,
        avatar: item.profile.picture.original.url
      }
      if(!userIds.includes(new_user.id)){
        userIds.push(new_user.id);
        usersList.push(new_user);
      }
    }

    console.log(usersList);
    setSuggestedList(usersList);
    setLoading(false);
  }

  return (
    <ListAccount
      title="Suggested accounts"
      list={suggestedList}
      onClick={handleSeeMore}
      perpage={perpage}
    />
  );
}

export default SuggestedList;
