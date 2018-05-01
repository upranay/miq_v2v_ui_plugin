import moment from 'moment';
import {
  getLocalStorageState,
  getLocalStorageNumericState,
  saveLocalStorageState,
  LOCAL_STORAGE_KEYS
} from '../common/LocalStorage';

/**
 * singleton class instance which emulates migrations in local storage
 */
class MigrationEmulator {
  constructor() {
    this.interval = null;
    this.PEND_TIME = getLocalStorageNumericState('V2V_PEND_TIME', 10); // time to stay in pending (seconds)
    this.EMULATION_INTERVAL = getLocalStorageNumericState(
      'V2V_EMULATION_INTERVAL',
      3000
    ); // interval to make updates (ms)
    this.DISK_INCREMENT_MIN = getLocalStorageNumericState(
      'V2V_DISK_INCREMENT_MIN',
      5000000000
    ); // min disk increment (5 gb/interval)
    this.DISK_INCREMENT_MAX = getLocalStorageNumericState(
      'V2V_DISK_INCREMENT_MAX',
      10000000000
    ); // max disk increment (10 gb/interval)
  }
  run() {
    if (!this.interval) {
      this.startPolling();
    }
  }
  startPolling() {
    this.interval = setInterval(() => {
      const plans = getLocalStorageState(LOCAL_STORAGE_KEYS.V2V_PLANS);

      if (plans && plans.length) {
        // main emulation loop which handles state transitions
        for (let i = 0; i < plans.length; i++) {
          const plan = plans[i];
          if (plan.miq_requests && plan.miq_requests.length) {
            let mostRecentRequest = plan.miq_requests.pop();

            if (mostRecentRequest.status === 'pending') {
              mostRecentRequest = this.handlePendingRequest(
                plan,
                mostRecentRequest
              );
            }

            if (mostRecentRequest.status === 'active') {
              mostRecentRequest = this.handleActiveRequest(
                plan,
                mostRecentRequest
              );
            }

            plan.miq_requests.push(mostRecentRequest);
          }
          plans[i] = plan;
        }
        saveLocalStorageState(LOCAL_STORAGE_KEYS.V2V_PLANS, plans);
      }
    }, this.EMULATION_INTERVAL);
  }
  stopPolling() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
  handlePendingRequest(plan, request) {
    // transition pending request if PEND_TIME > time since created
    const elapsedSeconds = moment
      .duration(moment().diff(moment(new Date(request.created_on))))
      .asSeconds();

    if (elapsedSeconds > this.PEND_TIME) {
      // simulate transition to active
      request.status = 'active';
      request.options = {};
      request.options.delivered_on = new Date().toISOString();
      request.miq_request_tasks.forEach((task, i) => {
        task.source_id = i.toString();
        task.message = 'Migrating';
        task.options.progress.current_description = 'Migrating';
        task.options.delivered_on = new Date().toISOString();
        task.state = 'active';
        task.status = 'Ok';
        task.updated_on = new Date().toISOString();
        // todo: set these based on mapped cluster (gather from plan's mapping)
        // hard code to disk store size in mocks for now
        if (i === 0) {
          task.options.virtv2v_disks = [{ percent: 0, size: 266000026560 }];
        } else if (i === 1) {
          task.options.virtv2v_disks = [{ percent: 0, size: 266480000000 }];
        } else if (i === 2) {
          task.options.virtv2v_disks = [{ percent: 0, size: 83100000000 }];
        } else if (i === 3) {
          task.options.virtv2v_disks = [{ percent: 0, size: 276480000000 }];
        } else if (i === 4) {
          task.options.virtv2v_disks = [{ percent: 0, size: 64000000000 }];
        } else if (i === 5) {
          task.options.virtv2v_disks = [{ percent: 0, size: 64000000000 }];
        } else if (i === 6) {
          task.options.virtv2v_disks = [{ percent: 0, size: 64000000000 }];
        } else if (i === 7) {
          task.options.virtv2v_disks = [{ percent: 0, size: 64000000000 }];
        } else {
          task.options.virtv2v_disks = [{ percent: 0, size: 532478427136 }];
        }
      });
    }
    return request;
  }

  handleActiveRequest(plan, request) {
    request.options.delivered_on = new Date().toISOString();

    for (let i = 0; i < request.miq_request_tasks.length; i++) {
      const task = request.miq_request_tasks[i];
      if (task.state === 'finished') {
        continue;
      }

      task.updated_on = new Date().toISOString();
      task.options.virtv2v_disks.forEach(disk => {
        // randomly increment disk migration
        const increment =
          Math.floor(
            Math.random() *
              (this.DISK_INCREMENT_MAX - this.DISK_INCREMENT_MIN + 1)
          ) + this.DISK_INCREMENT_MIN;
        const space_migrated =
          Math.ceil(disk.percent / 100 * disk.size) + increment;
        if (space_migrated >= disk.size) {
          disk.percent = 100;
        } else {
          disk.percent = Math.floor(space_migrated / disk.size * 100);
        }
      });

      const anyDisksIncomplete = task.options.virtv2v_disks.some(
        d => d.percent < 100
      );

      if (!anyDisksIncomplete) {
        task.state = 'finished';
        task.options.progress.current_description = 'Virtual machine migrated';
        task.message = 'VM Transformations completed';
      }
      request.miq_request_tasks[i] = task;
    }

    // check if all tasks completed and we need to complete the plan
    const anyTasksIncomplete = request.miq_request_tasks.some(
      t => t.state !== 'finished'
    );
    if (!anyTasksIncomplete) {
      request.status = 'complete';
    }
    return request;
  }
}
export default new MigrationEmulator();
