import Bee from 'bee-queue';
import CancellationMail from '../app/jobs/CancellationMail';
import redisConfig from '../config/redis';

const jobs = [CancellationMail];

class Queue {
  constructor() {
    this.queues = {}; // armazena todos os jobs

    this.init();
  }

  init() {
    // key e handle são as informações do job de Cancellation
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  add(queue, job) {
    // adiciona job na fila em 2º plano
    return this.queues[queue].bee.createJob(job).save(); // parametro entre chaves [] seria CancellationMail
  }

  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key]; //buscar dados bee e handle da fila relacionada ao job

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
