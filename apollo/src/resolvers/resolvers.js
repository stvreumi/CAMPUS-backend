const {
  tagResolvers,
  statusResolvers,
  userResolvers,
  coordinateResolvers,
  pageResolvers,
} = require('./map_resolvers');

/**
 * @typedef {import('../types').ResolverArgsInfo} ResolverArgsInfo
 * @typedef {import('../types').AddTagDataInput} AddTagDataInput
 * @typedef {import('../types').UpdateTagDataInput} UpdateTagDataInput
 * @typedef {import('../types').PageParams} PageParams
 */

const queryResolvers = {
  Query: {
    /**
     * @param {*} _
     * @param {{pageParams: PageParams}} params
     * @param {ResolverArgsInfo} info
     */
    unarchivedTagList: async (_, { pageParams }, { dataSources }) =>
      dataSources.tagDataSource.getAllUnarchivedTags(pageParams),
    /**
     * @param {*} _
     * @param {{tagId: string}} params
     * @param {ResolverArgsInfo} info
     */
    tag: async (_, { tagId }, { dataSources }) =>
      dataSources.tagDataSource.getTagData({ tagId }),
    /**
     * @param {*} _
     * @param {{uid: string, pageParams: PageParams}} params
     * @param {ResolverArgsInfo} info
     */
    userAddTagHistory: async (_, { uid, pageParams }, { dataSources }) =>
      dataSources.tagDataSource.getUserAddTagHistory({ uid, pageParams }),
    /**
     * @param {*} _
     * @param {*} __
     * @param {ResolverArgsInfo} info
     */
    hasReadGuide: async (_, __, { dataSources, userInfo }) =>
      dataSources.userDataSource.getHasReadGuideStatus({ userInfo }),
    /**
     * @param {*} _
     * @param {*} __
     * @param {ResolverArgsInfo} info
     */
    archivedThreshold: async (_, __, { dataSources }) =>
      dataSources.tagDataSource.archivedThreshold,
  },
};

const mutationResolvers = {
  Mutation: {
    /**
     * @param {*} _
     * @param {{data: AddTagDataInput}} param
     * @param {ResolverArgsInfo} info
     */
    addNewTagData: async (_, { data }, { dataSources, userInfo }) => {
      const { tag, imageUploadNumber } =
        await dataSources.tagDataSource.addNewTagData({ data, userInfo });
      const imageUploadUrls = Promise.all(
        dataSources.storageDataSource.getImageUploadUrls({
          imageUploadNumber,
          tagId: tag.id,
        })
      );
      return { tag, imageUploadNumber, imageUploadUrls };
    },
    /**
     *
     * @param {*} _
     * @param {{tagId: string, data: UpdateTagDataInput}} param
     * @param {ResolverArgsInfo} info
     */
    updateTagData: async (_, { tagId, data }, { dataSources, userInfo }) => {
      const { imageDeleteUrls, imageUploadNumber = 0 } = data;
      const { tag } = await dataSources.tagDataSource.updateTagData({
        tagId,
        data,
        userInfo,
      });
      return {
        tag,
        imageUploadNumber,
        imageUploadUrls: await dataSources.storageDataSource.getImageUploadUrls(
          { imageUploadNumber, tagId }
        ),
        imageDeleteStatus: await dataSources.storageDataSource.doImageDelete(
          tagId,
          imageDeleteUrls
        ),
      };
    },
    /**
     *
     * @param {*} _
     * @param {{tagId: string, statusName: string, description: string, hasNumberOfUpVote: string}} param
     * @param {ResolverArgsInfo} info
     * @returns
     */
    updateTagStatus: async (
      _,
      { tagId, statusName, description, hasNumberOfUpVote = false },
      { dataSources, userInfo }
    ) =>
      dataSources.tagDataSource.updateTagStatus({
        tagId,
        statusName,
        description,
        userInfo,
        hasNumberOfUpVote,
      }),
    /**
     *
     * @param {*} _
     * @param {{tagId: string, action: string}} param
     * @param {ResolverArgsInfo} info
     */
    updateUpVoteStatus: async (
      _,
      { tagId, action },
      { dataSources, userInfo }
    ) =>
      dataSources.tagDataSource.updateNumberOfUpVote({
        tagId,
        action,
        userInfo,
      }),
    /**
     *
     * @param {*} _
     * @param {*} __
     * @param {ResolverArgsInfo} info
     */
    setHasReadGuide: async (_, __, { dataSources, userInfo }) =>
      dataSources.userDataSource.setHasReadGuide({ userInfo }),
    /**
     * @param {*} _
     * @param {{tagId: string}} string
     * @param {ResolverArgsInfo} info
     */
    incrementViewCount: async (_, { tagId }, { dataSources, userInfo }) =>
      dataSources.tagDataSource.incrementTagViewCount(tagId, userInfo),
  },
};

const subscriptionResolvers = {
  Subscription: {
    archivedThreshold: {
      subscribe: (_, __, { pubsub }) =>
        pubsub.asyncIterator(['archivedThreshold_change']),
    },
    tagChangeSubscription: {
      // TODO
      // It seems that we don't need to add timestamp. When the client
      // connect and subscribe, it just receive the event happended after that.
      // So the client should create connection to subscription before query
      // to prevent when there is event occured in the query time?
      // Still needed, or the snapshot would return every tags on every connection
      // may need to rewrite the async iterator
      // Write this comment to the notion.
      // add a regex in the pubsub subscribe function, and add to the subscriptions
      // using the event name
      subscribe: (_, { subAfter }, { pubsub }) =>
        pubsub.asyncIterator([`tagChangeSubscription_${subAfter}`]),
    },
  },
};

const resolvers = {
  ...queryResolvers,
  ...mutationResolvers,
  ...subscriptionResolvers,
  ...tagResolvers,
  ...statusResolvers,
  ...userResolvers,
  ...coordinateResolvers,
  ...pageResolvers,
};

module.exports = resolvers;