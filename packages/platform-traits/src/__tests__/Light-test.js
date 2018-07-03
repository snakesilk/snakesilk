const expect = require('expect.js');
const sinon = require('sinon');

const {PointLight, SpotLight} = require('three');
const {Entity, Loops} = require('@snakesilk/engine');
const Light = require('../Light');

describe('Light', () => {
  let light, host;

  describe('on instantiation', () => {
    beforeEach(() => {
      light = new Light();
    });

    it('has name', () => {
      expect(light.NAME).to.be('light');
    });

    describe('#addLamp', () => {
      beforeEach(() => {
        light.addLamp(new Light.Lamp());
      });

      it('adds a lamp', () => {
        expect(light.lamps.length).to.be(1);
      });
    });

    describe('when applied', () => {
      beforeEach(() => {
        light.addLamp(new Light.Lamp(new PointLight()));
        light.addLamp(new Light.Lamp(new SpotLight()));
        host = new Entity();
        host.applyTrait(light);
      });

      it('exposes trait as "light"', () => {
        expect(host.light).to.be(light);
      });

      it('adds light of each lamp to host', () => {
        expect(host.model.children).to.contain(light.lamps[0].light);
        expect(host.model.children).to.contain(light.lamps[1].light);
      });

      it('adds target to host if exists', () => {
        expect(host.model.children).to.contain(light.lamps[1].light.target);
      });

      describe('#on', () => {
        beforeEach(() => {
          sinon.stub(light.lamps[0], 'start');
          sinon.stub(light.lamps[1], 'start');
          light.on();
        });

        it('calls each lamps start() method', () => {
          expect(light.lamps[0].start.callCount).to.be(1);
          expect(light.lamps[1].start.callCount).to.be(1);
        });
      });

      describe('#off', () => {
        beforeEach(() => {
          sinon.stub(light.lamps[0], 'stop');
          sinon.stub(light.lamps[1], 'stop');
          light.off();
        });

        it('calls each lamps start() method', () => {
          expect(light.lamps[0].stop.callCount).to.be(1);
          expect(light.lamps[1].stop.callCount).to.be(1);
        });
      });

      describe('when host changes direction', () => {
        beforeEach(() => {
          sinon.stub(light.lamps[0], 'setDirection');
          sinon.stub(light.lamps[1], 'setDirection');

          host.direction.x = -1;
          host.timeShift(0);
        });

        [0, 1].forEach(index => {
          describe(`lamp ${index}`, () => {
            it('is called only once', () => {
              const lamp = light.lamps[index];
              host.timeShift(.02);
              host.timeShift(.12);
              expect(lamp.setDirection.callCount).to.be(1);
            });

            it('is called with new direction', () => {
              const lamp = light.lamps[index];
              expect(lamp.setDirection.lastCall.args[0]).to.be(-1);
            });
          });
        });
      });
    });
  });

  describe('Lamp', () => {
    describe('on instantiation', () => {
      let lamp, light;

      beforeEach(() => {
        light = new SpotLight(0xffffff, 1.4);
        lamp = new Light.Lamp(light);
      });

      it('turned source light off', () => {
        expect(lamp.light.intensity).to.be(0);
      });

      it('saved intensity of source', () => {
        expect(lamp.intensity).to.be(1.4);
      });

      it('has easeOn easing', () => {
        expect(lamp.easeOn(.2)).to.be(1.1244710430646594);
      });

      it('has easeOff easing', () => {
        expect(lamp.easeOff(.4)).to.be(0.92224);
      });

      describe('#on', () => {
        beforeEach(() => {
          lamp.on();
        });

        it('turns on light', () => {
          expect(lamp.light.intensity).to.be(1.4);
        });

        describe('#off', () => {
          beforeEach(() => {
            lamp.off();
          });

          it('turns off light', () => {
            expect(lamp.light.intensity).to.be(0);
          });
        });
      });

      describe('#start/stop', () => {
        let host;

        beforeEach(() => {
          host = {
            doFor: sinon.spy(),
          };
        });

        describe('#start', () => {
          beforeEach(() => {
            lamp.off();
            lamp.start(host);
          });

          it('calls doFor on host', () => {
            expect(host.doFor.callCount).to.be(1);
          });

          describe('#doFor', () => {
            it('called with heatUpTime', () => {
              expect(host.doFor.lastCall.args[0]).to.be(0.8);
            });

            it('called with a callback', () => {
              expect(host.doFor.lastCall.args[1]).to.be.a(Function);
            });

            describe('#callback', () => {
              let callback;

              beforeEach(() => {
                callback = host.doFor.lastCall.args[1];
              });

              it('sets light intensity using easing when called with a value', () => {
                callback(undefined, .5);
                expect(lamp.light.intensity).to.be(1.4219410398199495);
              });
            });
          });
        });

        describe('#stop', () => {
          beforeEach(() => {
            lamp.on();
            lamp.stop(host);
          });

          it('calls doFor on host', () => {
            expect(host.doFor.callCount).to.be(1);
          });

          describe('#doFor', () => {
            it('called with coolDownTime', () => {
              expect(host.doFor.lastCall.args[0]).to.be(1.0);
            });

            it('called with a callback', () => {
              expect(host.doFor.lastCall.args[1]).to.be.a(Function);
            });

            describe('#callback', () => {
              let callback;

              beforeEach(() => {
                callback = host.doFor.lastCall.args[1];
              });

              it('sets light intensity using easing when called with a value', () => {
                callback(undefined, .5);
                expect(lamp.light.intensity).to.be(0.043749999999999956);
              });
            });
          });
        });
      });

      describe('#setDirection', () => {
        beforeEach(() => {
          light.position.z = 10;
        });

        it('sets light position according to direction', () => {
          lamp.setDirection(-1);
          expect(light.position.z).to.be(-10);
          lamp.setDirection(1);
          expect(light.position.z).to.be(10);
        });
      });
    });
  });
});
