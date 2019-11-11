const os = require('os');
// 获取当前的瞬时CPU时间
const instantaneousCpuTime = () => {
    let idleCpu = 0;
    let tickCpu = 0;
    const cpus = os.cpus();
    const length = cpus.length;

    let i = 0;
	  while(i < length) {
      let cpu = cpus[i];

      for (let type in cpu.times) {
        tickCpu += cpu.times[type];
      }

      idleCpu += cpu.times.idle;
      i++;
    }

    const time = {
      idle: idleCpu / cpus.length,  // 单核CPU的空闲时间
      tick: tickCpu / cpus.length,  // 单核CPU的总时间
    };
	  return time;
}
const cpuMetrics = () => {
  const startQuantize = instantaneousCpuTime();
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const endQuantize = instantaneousCpuTime();
      const idleDifference = endQuantize.idle - startQuantize.idle;
      const tickDifference = endQuantize.tick - startQuantize.tick;

  		resolve(1 - (idleDifference / tickDifference));
    }, 1000);
  });
};

cpuMetrics().then(res => {
    console.log('cpu utilization: '+res);
	// 0.074999
});
