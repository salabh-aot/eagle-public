import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import 'rxjs/add/operator/switchMap';

import * as _ from 'lodash';

import { Constants } from 'app/shared/utils/constants';
import { TableTemplate } from 'app/shared/components/table-template-2/table-template';
import { TableObject2 } from 'app/shared/components/table-template-2/table-object-2';
import { SearchParamObject } from 'app/services/search.service';
import { OrgService } from 'app/services/org.service';
import { TableService } from 'app/services/table.service';

@Injectable()
export class ProjectListResolver implements Resolve<void> {
  private tableId = 'projectList';
  constructor(
    private tableService: TableService,
    private orgService: OrgService,
    private tableTemplateUtils: TableTemplate
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    this.tableService.clearTable(this.tableId);
    this.orgService.fetchProponent();

    const params = route.queryParamMap['params'];
    const tableObject = this.tableTemplateUtils.updateTableObjectWithUrlParams(
      params,
      new TableObject2()
    );

    if (!params.sortBy) {
      tableObject.sortBy = '+name';
    }

    let keywords = '';
    params.keywords
      ? (keywords = params.keywords)
      : (keywords = Constants.tableDefaults.DEFAULT_KEYWORDS);

    const filtersForAPI = this.tableTemplateUtils.getFiltersFromParams(params, [
      'type',
      'eacDecision',
      'decisionDateStart',
      'decisionDateEnd',
      'pcp',
      'proponent',
      'region',
      'CEAAInvolvement',
      'currentPhaseName',
      'changedInLast30days',
      'favouritesOnly',
    ]);

    const dateFiltersForAPI = this.tableTemplateUtils.getDateFiltersFromParams(
      params,
      ['decisionDateStart', 'decisionDateEnd']
    );

    this.tableService.initTableData(this.tableId);
    this.tableService.fetchData(new SearchParamObject(
      this.tableId,
      keywords,
      'Project',
      [],
      tableObject.currentPage,
      tableObject.pageSize,
      tableObject.sortBy,
      {},
      true,
      null,
      { ...filtersForAPI, ...dateFiltersForAPI },
      '',
      false
    ));
  }
}
