import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { getContext, mapProps, compose, withHandlers } from 'recompose';
import { sortPropertyByIdSelector, iconByNameSelector, customHeadingComponentSelector } from '../selectors/dataSelectors';
import { setSortProperties } from '../utils/columnUtils';

const DefaultTableHeadingCellContent = ({title, icon}) => (
  <span>
    { title }
    { icon && <span>{icon}</span> }
  </span>
)

function getIcon({sortProperty, sortAscendingIcon, sortDescendingIcon}) {
console.log(sortProperty);
  if (sortProperty) {
    return sortProperty.sortAscending ? sortAscendingIcon : sortDescendingIcon;
  }

  // return null so we don't render anything if no sortProperty
  return null;
}

const EnhancedHeadingCell = OriginalComponent => compose(
  connect(
    (state, props) => ({
      sortProperty: sortPropertyByIdSelector(state, props),
      sortAscendingIcon: iconByNameSelector(state, { name: 'sortAscending'}),
      sortDescendingIcon: iconByNameSelector(state, { name: 'sortDescending'}),
      customHeadingComponent: customHeadingComponentSelector(state, props)
    })
  ),
  getContext({
    events: PropTypes.object
  }),
  withHandlers({
    onClick: ({ events: { onSort }, columnId }) => event => {
      onSort({ id: columnId })
    }
  }),
  mapProps(props => {
    const icon = getIcon(props);
    const title = props.customHeadingComponent ?
      <props.customHeadingComponent {...props} icon={icon} /> :
      <DefaultTableHeadingCellContent title={props.title} icon={icon} />;

    return {
      ...props,
      icon,
      title
    };
  })
)((props) => {
  return (
    <OriginalComponent {...props} />
  );
});

export default EnhancedHeadingCell;
