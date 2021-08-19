/*
 * @flow strict-local
 * Copyright (C) 2021 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import * as React from 'react';

import formatDate from '../../static/scripts/common/utility/formatDate';
import DescriptiveLink
  from '../../static/scripts/common/components/DescriptiveLink';
import EntityLink from '../../static/scripts/common/components/EntityLink';
import ReleaseEvents
  from '../../static/scripts/common/components/ReleaseEvents';
import formatBarcode from '../../static/scripts/common/utility/formatBarcode';
import Diff from '../../static/scripts/edit/components/edit/Diff';

type EditReleaseLabelEditT = {
  ...EditT,
  +display_data: {
    +barcode: string | null,
    +catalog_number?: {
      +new?: string | null,
      +old: string | null,
    },
    +combined_format?: string,
    +events: $ReadOnlyArray<ReleaseEventT>,
    +label?: {
      +new?: LabelT | null,
      +old: LabelT | null,
    },
    +release: ReleaseT,
  },
};

type Props = {
  +edit: EditReleaseLabelEditT,
};

const EditReleaseLabel = ({edit}: Props): React.Element<'table'> => {
  const display = edit.display_data;
  const barcode = display.barcode;
  const catNo = display.catalog_number;
  const label = display.label;
  const releaseEvents = display.events;
  const hasMultipleEvents = display.events?.length > 1;
  const firstEvent = display.events[0];
  const firstDate = firstEvent?.date;
  const firstCountry = firstEvent?.country;

  return (
    <table className="details edit-release-label">
      {edit.preview /*:: === true */ ? null : (
        <tr>
          <th>{addColonText(l('Release'))}</th>
          <td colSpan="2">
            <DescriptiveLink entity={display.release} />
          </td>
        </tr>
      )}

      {label ? (
        <tr>
          <th>{addColonText(l('Label'))}</th>
          {label.new ? (
            <>
              <td className="old">
                {label.old ? (
                  <EntityLink entity={label.old} />
                ) : null}
              </td>
              <td className="new">
                <EntityLink entity={label.new} />
              </td>
            </>
          ) : (
            <td colSpan="2">
              {label.old ? (
                <EntityLink entity={label.old} />
              ) : null}
            </td>
          )}
        </tr>
      ) : null}

      {catNo ? (
        catNo.new === undefined ? (
          <tr>
            <th>{addColonText(l('Catalog number'))}</th>
            <td colSpan="2">{catNo.old}</td>
          </tr>
        ) : (
          <Diff
            label={addColonText(l('Catalog number'))}
            newText={catNo.new ?? ''}
            oldText={catNo.old ?? ''}
          />
        )
      ) : null}

      {hasMultipleEvents ? (
        <tr>
          <th>{addColonText(l('Release events'))}</th>
          <td colSpan="2">
            <ReleaseEvents events={releaseEvents} />
          </td>
        </tr>
      ) : firstDate || firstCountry ? (
        <>
          {firstDate ? (
            <tr>
              <th>{addColonText(l('Date'))}</th>
              <td colSpan="2">
                {formatDate(firstDate)}
              </td>
            </tr>
          ) : null}
          {firstCountry ? (
            <tr>
              <th>{addColonText(l('Country'))}</th>
              <td colSpan="2">
                <EntityLink entity={firstCountry} />
              </td>
            </tr>
          ) : null}
        </>
      ) : null}

      {barcode == null ? null : (
        <tr>
          <th>{addColonText(l('Barcode'))}</th>
          <td colSpan="2">{formatBarcode(barcode)}</td>
        </tr>
      )}

      {nonEmpty(display.combined_format) ? (
        <tr>
          <th>{addColonText(l('Format'))}</th>
          <td colSpan="2">{display.combined_format}</td>
        </tr>
      ) : null}
    </table>
  );
};

export default EditReleaseLabel;