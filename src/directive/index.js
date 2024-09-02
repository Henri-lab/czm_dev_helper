import hasRole from './permission/hasRole'
import hasPermi from './permission/hasPermi'
import copyText from './common/copyText'
import draggable from './common/draggable'
import mouseFollow from './common/mouseFollow'

export default function directive(app) {
  app.directive('has-role', hasRole)
  app.directive('has-permi', hasPermi)
  app.directive('copy-text', copyText)
  app.directive('draggable', draggable)
  app.directive('mouse-follow', mouseFollow)
}