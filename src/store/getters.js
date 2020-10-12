const getters = {
  username: state => state.user.username,
  account: state => state.user.account,
  token: state => state.user.token,
  tipmessage: state => state.user.tipmessage,
  tipvisible: state => state.user.tipvisible,
  bimapplyId: state => state.bimApply.id,
  bimapplyName: state => state.bimApply.name,
  pageId: state => state.bimApply.pageId,
  pageName: state => state.bimApply.pageName,
  dataConfigId: state => state.bimApply.dataConfigId,
  dataConfigName: state => state.bimApply.dataConfigName,
  dataType: state => state.bimApply.dataType
}
export default getters
