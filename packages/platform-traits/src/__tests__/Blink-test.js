const expect = require('expect.js');
const sinon = require('sinon');

const {Object3D} = require('three');
const {Entity} = require('@snakesilk/engine');
const Blink = require('../Blink');

describe('Blink', function() {
  describe('on instantiation', () => {
    let blink;

    beforeEach(() => {
      blink = new Blink();
    });

    it('has name', () => {
      expect(blink.NAME).to.be('blink');
    });

    it('has interval set', () => {
      expect(blink.interval).to.be(1.0);
    });

    it('has ratio set', () => {
      expect(blink.ratio).to.be(0.5);
    });

    describe('when applied', () => {
      const ROUNDING_FIX = 0.00000000001;
      let host;

      beforeEach(() => {
        host = new Entity();
        host.setModel(new Object3D());
        host.applyTrait(blink);
      });

      it('exposes itself', () => {
        expect(host.blink).to.be(blink);
      });

      it('starts visible', () => {
        host.timeShift(0);
        expect(host.model.visible).to.be(true);
      });

      [
        [1, .5],
        [4, .25],
        [13.12, .245],
      ].forEach(([interval, ratio]) => {
        describe(`with interval ${interval} and ratio ${ratio}`, () => {
          const timeAtOff = interval * ratio;
          const almostTimeAtOff = timeAtOff - ROUNDING_FIX;

          beforeEach(() => {
            blink.interval = interval;
            blink.ratio = ratio;
          });

          it('starts visible', () => {
            host.timeShift(0);
            expect(host.model.visible).to.be(true);
          });

          describe(`after ${almostTimeAtOff}s`, () => {
            beforeEach(() => {
              host.timeShift(almostTimeAtOff);
            });

            it('host is still visible', () => {
              expect(host.model.visible).to.be(true);
            });
          });

          describe(`after ${timeAtOff}s`, () => {
            beforeEach(() => {
              host.timeShift(timeAtOff);
            });

            it('has made host invisible', () => {
              expect(host.model.visible).to.be(false);
            });

            describe('when reset', () => {
              beforeEach(() => {
                blink.reset();
                host.timeShift(0);
              });

              it('is immediately visible', () => {
                expect(host.model.visible).to.be(true);
              });
            });
          });

          [1, 2, 3, 5, 19, 27].forEach(multiplier => {
            const timeAtRevolution = interval * multiplier + ROUNDING_FIX;
            describe(`after ${timeAtRevolution}s`, () => {
              beforeEach(() => {
                host.timeShift(timeAtRevolution);
              });

              it('host is visible', () => {
                expect(host.model.visible).to.be(true);
              });
            });
          });
        });
      });

      describe('with interval 0.250 and ratio 0.5', () => {
        beforeEach(() => {
          blink.interval = 0.250;
          blink.ratio = 0.5;
        });

        it('blinks at a rate of 8 times per second', () => {
          const step = 1/5000;
          let seconds = 2;
          let counter = 0;
          let last = host.model.visible;
          while (seconds > 0) {
            seconds -= step;
            host.timeShift(step);
            if (host.model.visible !== last) {
              ++counter;
              last = host.model.visible;
            }
          }
          expect(counter).to.be(16);
        });
      });
    });
  });
});
